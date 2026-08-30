// الحصول على slug من الرابط
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

async function loadWall() {
    if (!slug) {
        document.getElementById('wallContainer').innerHTML = '<h1 style="text-align:center; padding:4rem;">الجدار غير موجود</h1>';
        return;
    }

    // جلب الجدار
    const { data: walls, error: wallError } = await supabase
        .from('walls')
        .select('*')
        .eq('slug', slug)
        .single();

    if (wallError || !walls) {
        document.getElementById('wallContainer').innerHTML = '<h1 style="text-align:center; padding:4rem;">الجدار غير موجود</h1>';
        return;
    }

    const wall = walls;

    document.getElementById('wallTitle').textContent = wall.title;
    document.getElementById('wallDesc').textContent = wall.description || '';
    document.querySelector('.wall-header').style.borderTop = `4px solid ${wall.color}`;

    // جلب الشهادات المعتمدة
    const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('wall_id', wall.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    const grid = document.getElementById('testimonialsGrid');

    if (!testimonials || testimonials.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color: var(--gray); grid-column: 1/-1;">لا توجد شهادات معتمدة بعد</p>';
        return;
    }

    grid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card" style="border-top: 3px solid ${wall.color}">
            <div class="stars">${'⭐'.repeat(t.rating)}</div>
            <p class="testimonial-text">"${t.content}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">${t.author_name.charAt(0)}</div>
                <div>
                    <div class="author-name">${t.author_name}</div>
                    <div class="author-role">${new Date(t.created_at).toLocaleDateString('ar-SA')}</div>
                </div>
            </div>
        </div>
    `).join('');
}

loadWall();
