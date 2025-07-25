# Generated by Django 4.2.7 on 2025-07-16 19:54

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CitizenFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('citizen_name', models.CharField(max_length=100, verbose_name='اسم المواطن')),
                ('citizen_phone', models.CharField(max_length=17, verbose_name='رقم الهاتف')),
                ('citizen_email', models.EmailField(max_length=254, verbose_name='البريد الإلكتروني')),
                ('citizen_address', models.TextField(verbose_name='العنوان')),
                ('citizen_id', models.CharField(max_length=20, verbose_name='رقم الهوية')),
                ('feedback_type', models.CharField(choices=[('complaint', 'شكوى'), ('suggestion', 'اقتراح'), ('inquiry', 'استفسار'), ('compliment', 'شكر وتقدير'), ('report', 'بلاغ')], max_length=50, verbose_name='نوع الملاحظة')),
                ('title', models.CharField(max_length=200, verbose_name='عنوان الملاحظة')),
                ('description', models.TextField(verbose_name='وصف تفصيلي')),
                ('priority', models.CharField(choices=[('low', 'منخفض'), ('medium', 'متوسط'), ('high', 'عالي'), ('urgent', 'عاجل')], default='medium', max_length=20, verbose_name='الأولوية')),
                ('status', models.CharField(choices=[('pending', 'قيد المراجعة'), ('in_progress', 'قيد المعالجة'), ('resolved', 'تم الحل'), ('closed', 'مغلق')], default='pending', max_length=20, verbose_name='الحالة')),
                ('admin_notes', models.TextField(blank=True, null=True, verbose_name='ملاحظات الإدارة')),
                ('resolution', models.TextField(blank=True, null=True, verbose_name='الحل المتخذ')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')),
                ('resolved_at', models.DateTimeField(blank=True, null=True, verbose_name='تاريخ الحل')),
                ('assigned_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='مسند إلى')),
            ],
            options={
                'verbose_name': 'ملاحظة المواطن',
                'verbose_name_plural': 'ملاحظات المواطنين',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='GovernmentEntity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_name', models.CharField(max_length=200, verbose_name='اسم الجهة')),
                ('entity_type', models.CharField(choices=[('ministry', 'وزارة'), ('authority', 'هيئة'), ('commission', 'لجنة'), ('department', 'دائرة'), ('directorate', 'مديرية'), ('municipality', 'بلدية'), ('governorate', 'محافظة'), ('other', 'أخرى')], max_length=50, verbose_name='نوع الجهة')),
                ('governorate', models.CharField(choices=[('baghdad', 'بغداد'), ('basra', 'البصرة'), ('nineveh', 'نينوى'), ('erbil', 'أربيل'), ('najaf', 'النجف'), ('karbala', 'كربلاء'), ('wasit', 'واسط'), ('maysan', 'ميسان'), ('babylon', 'بابل'), ('dhi_qar', 'ذي قار'), ('anbar', 'الأنبار'), ('diyala', 'ديالى'), ('kirkuk', 'كركوك'), ('salah_al_din', 'صلاح الدين'), ('sulaymaniyah', 'السليمانية'), ('duhok', 'دهوك'), ('muthanna', 'المثنى'), ('qadisiyyah', 'القادسية')], max_length=50, verbose_name='المحافظة')),
                ('address', models.TextField(verbose_name='العنوان التفصيلي')),
                ('phone_number', models.CharField(max_length=17, validators=[django.core.validators.RegexValidator(message='رقم الهاتف غير صحيح', regex='^\\+?1?\\d{9,15}$')], verbose_name='رقم الهاتف')),
                ('email', models.EmailField(max_length=254, verbose_name='البريد الإلكتروني')),
                ('website', models.URLField(blank=True, null=True, verbose_name='الموقع الإلكتروني')),
                ('manager_name', models.CharField(max_length=100, verbose_name='اسم المسؤول')),
                ('manager_position', models.CharField(max_length=100, verbose_name='منصب المسؤول')),
                ('manager_phone', models.CharField(max_length=17, validators=[django.core.validators.RegexValidator(message='رقم الهاتف غير صحيح', regex='^\\+?1?\\d{9,15}$')], verbose_name='هاتف المسؤول')),
                ('manager_email', models.EmailField(max_length=254, verbose_name='بريد المسؤول الإلكتروني')),
                ('establishment_date', models.DateField(verbose_name='تاريخ التأسيس')),
                ('employee_count', models.IntegerField(verbose_name='عدد الموظفين')),
                ('annual_budget', models.DecimalField(decimal_places=2, max_digits=15, verbose_name='الميزانية السنوية (دينار)')),
                ('services_provided', models.TextField(verbose_name='الخدمات المقدمة')),
                ('target_audience', models.TextField(verbose_name='الجمهور المستهدف')),
                ('has_electronic_system', models.BooleanField(default=False, verbose_name='يوجد نظام إلكتروني')),
                ('system_description', models.TextField(blank=True, null=True, verbose_name='وصف النظام الإلكتروني')),
                ('publishes_reports', models.BooleanField(default=False, verbose_name='ينشر تقارير دورية')),
                ('has_complaints_system', models.BooleanField(default=False, verbose_name='يوجد نظام شكاوى')),
                ('has_quality_certificate', models.BooleanField(default=False, verbose_name='يوجد شهادة جودة')),
                ('quality_certificate_type', models.CharField(blank=True, max_length=100, null=True, verbose_name='نوع شهادة الجودة')),
                ('current_projects', models.TextField(verbose_name='المشاريع الحالية')),
                ('future_plans', models.TextField(verbose_name='الخطط المستقبلية')),
                ('partnerships', models.TextField(blank=True, null=True, verbose_name='الشراكات مع جهات أخرى')),
                ('international_cooperation', models.TextField(blank=True, null=True, verbose_name='التعاون الدولي')),
                ('performance_indicators', models.TextField(verbose_name='مؤشرات الأداء')),
                ('challenges', models.TextField(verbose_name='التحديات التي تواجه الجهة')),
                ('needs', models.TextField(verbose_name='الاحتياجات المطلوبة')),
                ('additional_notes', models.TextField(blank=True, null=True, verbose_name='ملاحظات إضافية')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الإنشاء')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='تاريخ التحديث')),
                ('is_approved', models.BooleanField(default=False, verbose_name='تم الموافقة')),
                ('approval_date', models.DateTimeField(blank=True, null=True, verbose_name='تاريخ الموافقة')),
                ('approved_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='approved_entities', to=settings.AUTH_USER_MODEL, verbose_name='تم الموافقة بواسطة')),
                ('submitted_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='مقدم الطلب')),
            ],
            options={
                'verbose_name': 'الجهة الحكومية',
                'verbose_name_plural': 'الجهات الحكومية',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='FormSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submission_type', models.CharField(choices=[('government_entity', 'جهة حكومية'), ('citizen_feedback', 'ملاحظة مواطن')], max_length=50, verbose_name='نوع التقديم')),
                ('reference_number', models.CharField(max_length=20, unique=True, verbose_name='الرقم المرجعي')),
                ('submitter_name', models.CharField(max_length=100, verbose_name='اسم المقدم')),
                ('submitter_email', models.EmailField(max_length=254, verbose_name='بريد المقدم')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التقديم')),
                ('processed_at', models.DateTimeField(blank=True, null=True, verbose_name='تاريخ المعالجة')),
                ('citizen_feedback', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='forms.citizenfeedback', verbose_name='ملاحظة المواطن')),
                ('government_entity', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='forms.governmententity', verbose_name='الجهة الحكومية')),
                ('processed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='تم المعالجة بواسطة')),
            ],
            options={
                'verbose_name': 'تقديم استمارة',
                'verbose_name_plural': 'تقديمات الاستمارات',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='citizenfeedback',
            name='related_entity',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='forms.governmententity', verbose_name='الجهة المعنية'),
        ),
    ]
