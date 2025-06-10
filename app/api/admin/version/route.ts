'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { getUserById } from "@/lib/db/queries";
import { updateAppVersion, getAppVersion } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema';
import { isNull } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication using the same method as admin pages
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the complete user from the database
    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Verify admin permissions
    if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the current app version
    const appVersion = await getAppVersion();

    return NextResponse.json({ version: appVersion });
  } catch (error) {
    console.error('Error getting app version:', error);
    return NextResponse.json({ error: 'Failed to get app version' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication using the same method as admin pages
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the complete user from the database
    const currentUser = await getUserById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Verify admin permissions
    if (currentUser.role !== 'admin' && currentUser.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get request data
    const data = await req.json();
    const { 
      version, 
      releaseNotes = '', 
      downloadUrl = '', 
      isCritical = false 
    } = data;

    if (!version) {
      return NextResponse.json({ error: 'Version is required' }, { status: 400 });
    }

    // Validate version format (x.y.z)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(version)) {
      return NextResponse.json({ error: 'Invalid version format. Use x.y.z format.' }, { status: 400 });
    }

    // Get current version BEFORE updating it
    const currentVersion = await getAppVersion();
    
    // If new version equals current version, no need to send notifications
    if (currentVersion === version) {
      return NextResponse.json({ 
        success: false, 
        message: 'The new version is the same as the current one',
        version: currentVersion
      }, { status: 400 });
    }

    // Update app version
    const updatedVersion = await updateAppVersion(version, currentUser.id);

    // Get all users to send notification
    const usersList = await db
      .select()
      .from(user)
      .where(isNull(user.deletedAt));

    console.log(`Notifying ${usersList.length} users about version ${version}`);
    let notificationSent = false;

    if (usersList.length > 0) {
      try {
        // Dynamically import email service
        const { sendVersionUpdateEmail } = await import('@/lib/email');
        
        // Send emails in batches to avoid server overload
        const batchSize = 10;
        for (let i = 0; i < usersList.length; i += batchSize) {
          const batch = usersList.slice(i, i + batchSize);
          
          // Process each batch in parallel
          const results = await Promise.allSettled(
            batch.map(user => {
              return sendVersionUpdateEmail({
                email: user.email,
                name: user.name || user.email.split('@')[0],
                currentVersion: currentVersion, // Use previous version
                newVersion: version, // Use new version
                releaseNotes: releaseNotes,
                downloadUrl: downloadUrl || null,
                isCritical: isCritical
              });
            })
          );
          
          // Check if at least one email was sent successfully
          if (results.some(result => result.status === 'fulfilled')) {
            notificationSent = true;
          }
        }
        
        console.log('Email notifications sent successfully');
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError);
        // Continue with the process even if emails fail
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'App version updated successfully and users notified',
      previousVersion: currentVersion,
      newVersion: updatedVersion,
      notificationSent: notificationSent,
      usersCount: usersList.length
    });
  } catch (error) {
    console.error('Error updating app version:', error);
    return NextResponse.json({ error: 'Failed to update app version' }, { status: 500 });
  }
} 