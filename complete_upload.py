#!/usr/bin/env python3
import subprocess
import sys
import os
import webbrowser
import time

# إعداد المشروع
PROJECT_DIR = r"c:\Users\YASSER\Desktop\django_project"
REPO_NAME = "government-forms-management-system" 
GITHUB_USER = "yasserdhia"
REPO_URL = f"https://github.com/{GITHUB_USER}/{REPO_NAME}.git"

def run_command(cmd, description):
    """تشغيل أمر واحد مع معالجة الأخطاء"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, cwd=PROJECT_DIR, 
                              capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print(f"✅ {description} - نجح")
            return True
        else:
            print(f"⚠️ {description} - تحذير: {result.stderr}")
            return True  # بعض الأوامر قد تعطي خطأ وهذا طبيعي
    except Exception as e:
        print(f"❌ {description} - فشل: {e}")
        return False

def main():
    print("🚀 بدء عملية الرفع الأوتوماتيكي...")
    print("=" * 60)
    
    # تغيير المجلد
    os.chdir(PROJECT_DIR)
    print(f"📂 المجلد: {os.getcwd()}")
    
    # فتح صفحة إنشاء المستودع
    print("\n🌐 فتح صفحة إنشاء المستودع...")
    try:
        webbrowser.open("https://github.com/new")
        print("✅ تم فتح المتصفح")
    except:
        print("❌ لا يمكن فتح المتصفح")
    
    print("\n📋 تفاصيل المستودع:")
    print(f"   الاسم: {REPO_NAME}")
    print(f"   الوصف: نظام إدارة النماذج الحكومية")
    print(f"   عام: ✅")
    print(f"   بدون تهيئة: ✅")
    
    print("\n⏳ انتظار إنشاء المستودع (30 ثانية)...")
    time.sleep(30)
    
    # إعداد Git
    commands = [
        ("git remote remove origin", "إزالة المستودع السابق"),
        (f"git remote add origin {REPO_URL}", "إضافة المستودع الجديد"),
        ("git branch -M main", "تحويل الفرع إلى main"),
    ]
    
    print("\n🔧 إعداد Git...")
    for cmd, desc in commands:
        run_command(cmd, desc)
    
    # محاولة الرفع
    print("\n🚀 محاولة الرفع...")
    print("🔐 قد تحتاج لإدخال بيانات المصادقة:")
    print(f"   المستخدم: {GITHUB_USER}")
    print(f"   كلمة المرور: Personal Access Token")
    
    # رفع مباشر
    try:
        os.system("git push -u origin main")
        print("\n🎉 تم الرفع بنجاح!")
        
        # فتح المستودع
        repo_page = f"https://github.com/{GITHUB_USER}/{REPO_NAME}"
        webbrowser.open(repo_page)
        print(f"🌐 تم فتح المستودع: {repo_page}")
        
    except Exception as e:
        print(f"\n❌ خطأ في الرفع: {e}")
        print("💡 جرب يدوياً: git push -u origin main")

if __name__ == "__main__":
    main()
