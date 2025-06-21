# WAF Web ACL for Application Load Balancer protection
resource "aws_wafv2_web_acl" "alb_waf" {
  name  = "${var.environment_name}-alb-waf"
  scope = "REGIONAL"  # For ALB use REGIONAL, for CloudFront use CLOUDFRONT
  
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
        
        # Exclude rules that might block legitimate traffic
        excluded_rule {
          name = "SizeRestrictions_BODY"  # If you need large request bodies
        }
        excluded_rule {
          name = "GenericRFI_BODY"  # If you have legitimate file uploads
        }
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
  
  # AWS Managed Rule Set - SQL Injection Protection
  rule {
    name     = "AWS-AWSManagedRulesSQLi"
    priority = 3
    
    override_action {
      none {}
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLi"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLiProtectionMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # Rate limiting rule (protects against DDoS and brute force)
  rule {
    name     = "RateLimitRule"
    priority = 4
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 2000  # requests per 5 minutes per IP
        aggregate_key_type = "IP"
        
        # Additional condition to only rate limit on certain paths
        scope_down_statement {
          or_statement {
            statement {
              byte_match_statement {
                search_string = "/api/"
                field_to_match {
                  uri_path {}
                }
                text_transformation {
                  priority = 0
                  type     = "LOWERCASE"
                }
                positional_constraint = "STARTS_WITH"
              }
            }
            statement {
              byte_match_statement {
                search_string = "/auth/"
                field_to_match {
                  uri_path {}
                }
                text_transformation {
                  priority = 0
                  type     = "LOWERCASE"
                }
                positional_constraint = "STARTS_WITH"
              }
            }
          }
        }
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # Admin paths protection (stronger rate limiting)
  rule {
    name     = "AdminPathsProtection"
    priority = 5
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 100  # Much stricter limit for admin paths
        aggregate_key_type = "IP"
        
        scope_down_statement {
          or_statement {
            statement {
              byte_match_statement {
                search_string = "/dashboard/admin"
                field_to_match {
                  uri_path {}
                }
                text_transformation {
                  priority = 0
                  type     = "LOWERCASE"
                }
                positional_constraint = "STARTS_WITH"
              }
            }
            statement {
              byte_match_statement {
                search_string = "/api/admin"
                field_to_match {
                  uri_path {}
                }
                text_transformation {
                  priority = 0
                  type     = "LOWERCASE"
                }
                positional_constraint = "STARTS_WITH"
              }
            }
          }
        }
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AdminPathsProtectionMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # Geo-blocking rule (optional - customize as needed)
  rule {
    name     = "GeoBlockRule"
    priority = 6
    
    action {
      block {}
    }
    
    statement {
      geo_match_statement {
        # Example: Block certain countries - customize this list
        country_codes = []  # Empty by default - add countries like ["CN", "RU"] if needed
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "GeoBlockMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # IP Reputation List (blocks known malicious IPs)
  rule {
    name     = "AWS-AWSManagedRulesAmazonIpReputationList"
    priority = 7
    
    override_action {
      none {}
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "IpReputationMetric"
      sampled_requests_enabled   = true
    }
  }
  
  # Anonymous IP List (blocks VPNs, proxies, Tor)
  rule {
    name     = "AWS-AWSManagedRulesAnonymousIpList"
    priority = 8
    
    override_action {
      count {}  # Count instead of block - you might want to allow VPNs
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAnonymousIpList"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AnonymousIpMetric"
      sampled_requests_enabled   = true
    }
  }
  
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "ALBWebACL"
    sampled_requests_enabled   = true
  }
  
  tags = {
    Name        = "${var.environment_name}-alb-waf"
    Environment = var.environment_name
  }
}

# Associate WAF with ALB
resource "aws_wafv2_web_acl_association" "alb_waf_association" {
  resource_arn = aws_lb.main.arn
  web_acl_arn  = aws_wafv2_web_acl.alb_waf.arn
}

# CloudWatch Log Group for WAF logs
resource "aws_cloudwatch_log_group" "waf_logs" {
  name              = "/aws/wafv2/${var.environment_name}-alb-waf"
  retention_in_days = 7  # Reduce costs - increase if you need longer retention
  
  tags = {
    Name        = "${var.environment_name}-waf-logs"
    Environment = var.environment_name
  }
}

# WAF Logging Configuration
resource "aws_wafv2_web_acl_logging_configuration" "alb_waf_logging" {
  resource_arn            = aws_wafv2_web_acl.alb_waf.arn
  log_destination_configs = [aws_cloudwatch_log_group.waf_logs.arn]
  
  # Redact sensitive fields from logs
  redacted_fields {
    single_header {
      name = "authorization"
    }
  }
  
  redacted_fields {
    single_header {
      name = "cookie"
    }
  }
} 