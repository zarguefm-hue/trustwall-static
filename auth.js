// ===== تسجيل الدخول =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.style.display = 'none';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                errorMsg.textContent = 'بيانات الدخول غير صحيحة';
                errorMsg.style.display = 'block';
                return;
            }

            window.location.href = 'dashboard.html';
        } catch (err) {
            errorMsg.textContent = 'حدث خطأ في الاتصال';
            errorMsg.style.display = 'block';
        }
    });
}

// ===== إنشاء حساب =====
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.style.display = 'none';

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name }
                }
            });

            if (error) {
                errorMsg.textContent = error.message === 'User already registered' 
                    ? 'البريد الإلكتروني مستخدم بالفعل' 
                    : error.message;
                errorMsg.style.display = 'block';
                return;
            }

            window.location.href = 'dashboard.html';
        } catch (err) {
            errorMsg.textContent = 'حدث خطأ في الاتصال';
            errorMsg.style.display = 'block';
        }
    });
}

// ===== تسجيل الخروج =====
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}
