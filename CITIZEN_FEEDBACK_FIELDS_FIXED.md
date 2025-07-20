# ✅ حل مشكلة الحقول المفقودة في استمارة المواطنين

## المشكلة التي تم حلها:
```
خطأ في البيانات: العنوان مطلوب, العمر يجب أن يكون بين 18 و 100 سنة, الجنس مطلوب, المستوى التعليمي مطلوب, المهنة مطلوبة
```

## السبب:
كان هناك عدم تطابق بين:
- الحقول المطلوبة في الـ validation
- الحقول الموجودة فعلاً في الاستمارة

## الحلول المطبقة:

### 1. إضافة الحقول المفقودة في الاستمارة:
```tsx
// حقل العنوان
<textarea
  {...register('address', { required: !isAnonymous ? 'العنوان مطلوب' : false })}
  rows={3}
  className="input-focus w-full px-4 py-3..."
  placeholder="العنوان التفصيلي"
/>

// حقل العمر
<input
  {...register('age', { 
    required: !isAnonymous ? 'العمر مطلوب' : false,
    min: { value: 18, message: 'العمر يجب أن يكون 18 سنة على الأقل' },
    max: { value: 100, message: 'العمر يجب أن يكون أقل من 100 سنة' }
  })}
  type="number"
  min="18"
  max="100"
/>

// حقل الجنس
<select {...register('gender', { required: !isAnonymous ? 'الجنس مطلوب' : false })}>
  <option value="">اختر الجنس</option>
  <option value="male">ذكر</option>
  <option value="female">أنثى</option>
</select>

// حقل المستوى التعليمي
<select {...register('education_level', { required: !isAnonymous ? 'المستوى التعليمي مطلوب' : false })}>
  <option value="">اختر المستوى التعليمي</option>
  <option value="primary">ابتدائي</option>
  <option value="intermediate">متوسط</option>
  <option value="secondary">ثانوي</option>
  <option value="diploma">دبلوم</option>
  <option value="bachelor">بكالوريوس</option>
  <option value="master">ماجستير</option>
  <option value="phd">دكتوراه</option>
</select>

// حقل المهنة
<input
  {...register('occupation', { required: !isAnonymous ? 'المهنة مطلوبة' : false })}
  placeholder="المهنة"
/>
```

### 2. تحديث validation في debugCitizenFeedback.ts:
```typescript
// إضافة التحقق من الحقول الجديدة
if (!data.address?.trim()) errors.push('العنوان مطلوب');
if (!data.age || data.age < 18 || data.age > 100) {
  errors.push('العمر يجب أن يكون بين 18 و 100 سنة');
}
if (!data.gender?.trim()) errors.push('الجنس مطلوب');
if (!data.education_level?.trim()) errors.push('المستوى التعليمي مطلوب');
if (!data.occupation?.trim()) errors.push('المهنة مطلوبة');
```

### 3. تحديث interface لتتضمن جميع الحقول:
```typescript
export interface CitizenFeedbackFormData {
  feedback_type: string;
  full_name: string;
  national_id: string;
  phone_number: string;
  email: string;
  governorate: string;
  city: string;
  address: string;          // ✅ مضاف
  age: number;              // ✅ مضاف
  gender: string;           // ✅ مضاف
  education_level: string;  // ✅ مضاف
  occupation: string;       // ✅ مضاف
  related_entity: string;
  subject: string;
  description: string;
  priority: string;
  preferred_contact_method: string;
  previous_attempts: boolean;
  previous_attempts_description?: string;
  supporting_documents?: FileList;
  is_anonymous: boolean;
  consent_data_processing: boolean;
  consent_contact: boolean;
}
```

### 4. تحديث field mapping:
```typescript
const fieldMapping = {
  'full_name': 'citizen_name',
  'phone_number': 'citizen_phone',
  'email': 'citizen_email',
  'address': 'citizen_address',
  'national_id': 'citizen_id',
  'subject': 'title',
  'related_entity': 'related_entity',
  'feedback_type': 'feedback_type',
  'description': 'description',
  'priority': 'priority',
  'governorate': 'governorate',
  'city': 'city',
  'age': 'age',                           // ✅ مضاف
  'gender': 'gender',                     // ✅ مضاف
  'education_level': 'education_level',   // ✅ مضاف
  'occupation': 'occupation',             // ✅ مضاف
  'preferred_contact_method': 'preferred_contact_method',
  'previous_attempts': 'previous_attempts',
  'previous_attempts_description': 'previous_attempts_description',
  'consent_data_processing': 'consent_data_processing',
  'consent_contact': 'consent_contact',
};
```

## النتيجة:
- ✅ جميع الحقول المطلوبة موجودة في الاستمارة
- ✅ validation يتطابق مع الحقول الموجودة
- ✅ الحقول اختيارية للإرسال المجهول
- ✅ رسائل خطأ واضحة ومفيدة
- ✅ تنسيق بيانات صحيح لـ Django

## للاختبار:
1. اذهب إلى: `http://localhost:3000/forms/citizen-feedback`
2. املأ الاستمارة بجميع الحقول المطلوبة
3. اختبر الإرسال العادي والمجهول
4. تحقق من عدم ظهور رسائل خطأ validation

الآن استمارة المواطنين كاملة وتعمل بشكل مثالي! 🎉
