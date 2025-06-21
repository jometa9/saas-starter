# 🚀 Despliegue AWS - SaaS Starter

## Resumen de la Arquitectura

Esta es la forma **más simple y barata** de desplegar tu aplicación SaaS completa en AWS con autoscaling:

### 🏗️ Componentes de la Infraestructura

1. **ECS Fargate** - Tu aplicación Next.js completa (frontend + backend)
2. **RDS PostgreSQL** - Base de datos (db.t4g.micro)
3. **Application Load Balancer** - Distribución de tráfico
4. **ECR** - Repositorio de imágenes Docker
5. **S3** - Almacenamiento de archivos
6. **CloudWatch** - Logs y monitoreo
7. **Auto Scaling** - Escala automática basada en CPU

### 💰 Estimación de Costos Mensuales

| Servicio                  | Configuración                       | Costo Estimado/Mes |
| ------------------------- | ----------------------------------- | ------------------ |
| ECS Fargate               | 0.5 vCPU, 1GB RAM, 1-3 contenedores | $15-45             |
| RDS PostgreSQL            | db.t4g.micro, 20GB                  | $13                |
| Application Load Balancer | -                                   | $16                |
| S3                        | 1GB + requests                      | $1                 |
| CloudWatch Logs           | 1GB logs                            | $1                 |
| ECR                       | 1GB almacenamiento                  | $0.10              |
| **TOTAL ESTIMADO**        | -                                   | **$46-76/mes**     |

> **Nota**: Estos son costos estimados para tráfico bajo-medio. Con AWS Free Tier, algunos costos pueden ser menores el primer año.

## 🎯 Ventajas de esta Arquitectura

✅ **Simple**: Una sola aplicación Next.js en lugar de separar frontend/backend  
✅ **Barato**: Usa los tipos de instancia más económicos  
✅ **Escalable**: Auto-scaling automático basado en CPU  
✅ **Mantenible**: Infraestructura como código con Terraform  
✅ **Seguro**: VPC, security groups, y encriptación habilitada

## 🚀 Despliegue Rápido (Automático)

### Opción 1: Script Automático (Recomendado)

```bash
# Desde la raíz del proyecto
./scripts/deploy-aws.sh
```

Este script hace todo automáticamente:

1. Verifica prerequisitos
2. Despliega la infraestructura paso a paso
3. Construye y sube la imagen Docker
4. Configura todas las variables de entorno
5. Te da la URL final

### Opción 2: Despliegue Manual

#### Prerequisitos

1. **AWS CLI** configurado con credenciales
2. **Terraform** instalado (v1.0.0+)
3. **Docker** instalado

#### Pasos Manuales

1. **Configurar variables**:

```bash
cd aws-template
cp terraform.tfvars.example terraform.tfvars
# Editar terraform.tfvars con tus valores
```

2. **Desplegar infraestructura por pasos**:

```bash
# Paso 1: VPC
terraform init
terraform plan -target=module.vpc
terraform apply -target=module.vpc

# Paso 2: ECR
terraform plan -target=module.ecr
terraform apply -target=module.ecr

# Paso 3: Construir y subir imagen
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ECR_URL]
docker build -t saas-starter-nextjs .
docker tag saas-starter-nextjs:latest [ECR_URL]:latest
docker push [ECR_URL]:latest

# Paso 4: Storage y Database
terraform plan -target=module.storage
terraform apply -target=module.storage
terraform plan -target=module.database
terraform apply -target=module.database

# Paso 5: ECS Service
terraform plan -target=module.ecs
terraform apply -target=module.ecs
```

## ⚙️ Configuración de Variables de Entorno

Las variables principales que debes configurar en `terraform.tfvars`:

```hcl
# Database
db_password = "TuPasswordSegura123!"

# Environment Variables
environment_variables = {
  "POSTGRES_URL" = "postgresql://postgres:TuPassword@DB_HOST:5432/saas_starter"
  "NEXTAUTH_SECRET" = "tu-nextauth-secret-muy-seguro"
  "STRIPE_SECRET_KEY" = "sk_live_o_test_tu_stripe_key"
  "RESEND_API_KEY" = "re_tu_resend_api_key"
  # Agregar otras variables según necesites
}
```

## 🔧 Configuración de Dominio (Opcional)

Para usar tu dominio personalizado:

1. **Obtener certificado SSL**:

```bash
# En AWS Certificate Manager
aws acm request-certificate --domain-name tudominio.com --validation-method DNS
```

2. **Actualizar terraform.tfvars**:

```hcl
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
```

3. **Configurar DNS**: Apuntar tu dominio al ALB DNS name

## 📊 Monitoreo y Scaling

### Auto Scaling Configurado

- **Mínimo**: 1 contenedor
- **Máximo**: 3 contenedores
- **Trigger**: 70% CPU utilization
- **Cooldown**: 300 segundos

### Logs y Monitoreo

- **CloudWatch Logs**: `/aws/ecs/saas-starter-apis`
- **Health Checks**: `/api/status`
- **Métricas**: CPU, memoria, requests

## 🔒 Seguridad

- ✅ VPC con subnets públicas
- ✅ Security Groups restrictivos
- ✅ RDS con encriptación
- ✅ HTTPS disponible con certificado
- ✅ IAM roles con permisos mínimos

## 🗄️ Base de Datos

### Migraciones

Después del despliegue, ejecutar migraciones:

```bash
# Conectar a la base de datos RDS
psql -h [RDS_ENDPOINT] -U postgres -d saas_starter

# O usar tu script de migración existente
DATABASE_URL="postgresql://postgres:password@[RDS_ENDPOINT]:5432/saas_starter" npm run db:migrate
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **ECS Service no inicia**:

   - Verificar logs en CloudWatch
   - Comprobar health check endpoint `/api/status`
   - Verificar variables de entorno

2. **Cannot connect to database**:

   - Verificar security groups
   - Comprobar credenciales de base de datos
   - Verificar que RDS esté en estado "available"

3. **404 en el ALB**:
   - Verificar que el target group tenga targets healthy
   - Comprobar que el contenedor esté corriendo en puerto 3000

### Comandos Útiles

```bash
# Ver logs del servicio ECS
aws logs tail /aws/ecs/saas-starter-apis --follow

# Ver estado del servicio
aws ecs describe-services --cluster saas-starter-cluster --services saas-starter-nextjs

# Verificar targets del load balancer
aws elbv2 describe-target-health --target-group-arn [TARGET_GROUP_ARN]
```

## 🧹 Limpieza

Para destruir toda la infraestructura:

```bash
cd aws-template
terraform destroy
```

## 📞 Soporte

Si tienes problemas:

1. Revisar logs de CloudWatch
2. Verificar la configuración de terraform.tfvars
3. Comprobar que todos los servicios estén en estado "running"

---

**¡Tu aplicación SaaS estará lista en aproximadamente 10-15 minutos! 🎉**
