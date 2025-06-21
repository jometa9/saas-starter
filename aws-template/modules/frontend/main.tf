resource "aws_s3_bucket" "frontend" {
  bucket = var.bucket_name

  tags = {
    Name = var.bucket_name
  }
}

resource "aws_s3_bucket_ownership_controls" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
  
  depends_on = [aws_s3_bucket.frontend]
}

resource "aws_s3_bucket_acl" "frontend" {
  depends_on = [
    aws_s3_bucket_ownership_controls.frontend,
    aws_s3_bucket_public_access_block.frontend,
  ]

  bucket = aws_s3_bucket.frontend.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  # Wait for public access block settings to be applied
  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# WAF Web ACL for CloudFront protection
resource "aws_wafv2_web_acl" "frontend_waf" {
  count = var.enable_cloudfront ? 1 : 0
  
  name  = "${var.environment_name}-frontend-waf"
  scope = "CLOUDFRONT"
  
  default_action {
    allow {}
  }
  
  # AWS Managed Rule Set - Core Rule Set (protects against OWASP Top 10)
  rule {
    name     = "AWS-AWSManagedRulesCore"
    priority = 1
    
    override_action {
      none {}
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCore"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CoreRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # AWS Managed Rule Set - Known Bad Inputs
  rule {
    name     = "AWS-AWSManagedRulesKnownBadInputs"
    priority = 2
    
    override_action {
      none {}
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputs"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputsMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # Rate limiting rule (protects against DDoS)
  rule {
    name     = "RateLimitRule"
    priority = 3
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 2000  # requests per 5 minutes
        aggregate_key_type = "IP"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # Geo-blocking rule (optional - you can customize countries)
  rule {
    name     = "GeoBlockRule"
    priority = 4
    
    action {
      block {}
    }
    
    statement {
      geo_match_statement {
        # Block these countries (add any you want to block)
        country_codes = ["CN", "RU"]  # Example: Block China and Russia
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "GeoBlockMetric"
      sampled_requests_enabled   = true
    }
  }
  
  visibility_config {
    cloudfront_metrics_enabled = true
    metric_name                = "frontendWAF"
    sampled_requests_enabled   = true
  }
  
  tags = {
    Name = "${var.environment_name}-frontend-waf"
  }
}

resource "aws_cloudfront_distribution" "frontend" {
  count = var.enable_cloudfront ? 1 : 0
  
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.environment_name} Frontend Distribution"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  web_acl_id          = var.enable_cloudfront ? aws_wafv2_web_acl.frontend_waf[0].arn : null
  
  aliases = var.domain_name != "" ? [var.domain_name] : []

  origin {
    domain_name = aws_s3_bucket_website_configuration.frontend.website_endpoint
    origin_id   = "S3-${var.bucket_name}"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
    
    # Origin Shield for additional DDoS protection
    origin_shield {
      enabled              = true
      origin_shield_region = "us-east-1"  # Choose closest region to your users
    }
  }
  
  # Security headers for additional protection
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
      headers = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress              = true
    
    # Response headers policy for security
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers[0].id
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
      # If you want to restrict by country:
      # restriction_type = "blacklist"
      # locations        = ["CN", "RU"]  # Example countries to block
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.certificate_arn == "" ? true : false
    acm_certificate_arn            = var.certificate_arn != "" ? var.certificate_arn : null
    ssl_support_method             = var.certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version       = var.certificate_arn != "" ? "TLSv1.2_2021" : "TLSv1.2_2019"
  }
  
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  tags = {
    Name = "${var.environment_name}-frontend-distribution"
  }
}

# Security headers policy
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  count = var.enable_cloudfront ? 1 : 0
  
  name    = "${var.environment_name}-security-headers"
  comment = "Security headers for frontend"
  
  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      override                   = true
    }
    
    content_type_options {
      override = true
    }
    
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }
  
  custom_headers_config {
    items {
      header   = "X-Content-Security-Policy"
      value    = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https:;"
      override = true
    }
    
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }
  }
}
