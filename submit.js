const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

async function loadWallInfo() {
    if (!slug) return;

    const { data: wall, error } = await supabase
        .from('walls')
        .select('*')
        .eq('slug', slug)
        .single();

    if (wall && wall.welcome_message) {
        document.getElementById('welcomeMsg').textContent = wall.welcome_message;
    }
}

loadWallInfo();

document.getElementById('submitForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!slug) {
        document.getElementById('errorMsg').textContent = 'رابط غير صحيح';
        document.getElementById('errorMsg').style.display = 'block';
        return;
    }

    // جلب معرف الجدار
    const { data: wall, error: wallError } = await supabase
        .from('walls')
        .select('id')
        .eq('slug', slug)
        .single();

    if (wallError || !wall) {
        document.getElementById('errorMsg').textContent = 'الجدار غير موجود';
        document.getElementById('errorMsg').style.display = 'block';
        return;
    }

    const rating = document.querySelector('input[name="rating"]:checked')?.value || 5;

    const { data, error } = await supabase
        .from('testimonials')
        .insert([{
            wall_id: wall.id,
            author_name: document.getElementById('author_name').value,
            author_email: document.getElementById('author_email').value,
            content: document.getElementById('content').value,
            rating: parseInt(rating),
            status: 'pending'
        }])
        .select();

    if (error) {
        document.getElementById('errorMsg').textContent = 'حدث خطأ: ' + error.message;
        document.getElementById('errorMsg').style.display = 'block';
        return;
    }

    document.getElementById('submitForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
});
