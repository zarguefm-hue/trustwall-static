// ⚠️ ضع بياناتك هنا بعد إنشاء حساب Supabase
// اذهب إلى: https://supabase.com → مشروعك → Settings → API

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// إنشاء عميل Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة مساعدة للتحقق من الجلسة
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// دالة للتحقق من تسجيل الدخول (للصفحات المحمية)
async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}
