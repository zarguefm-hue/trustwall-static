let currentWallId = null;

// التحقق من تسجيل الدخول
requireAuth().then(user => {
    if (user) {
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = 'مرحباً، ' + (user.user_metadata?.full_name || 'مستخدم');
        }
        loadWalls();
    }
});

// ===== تحميل الجدران =====
async function loadWalls() {
    const user = await getCurrentUser();
    if (!user) return;

    const { data: walls, error } = await supabase
        .from('walls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById('wallsList');

    if (!walls || walls.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <h3>لا يوجد جدران بعد</h3>
                <p>أنشئ أول جدار لجمع شهادات عملائك</p>
            </div>
        `;
        return;
    }

    container.innerHTML = walls.map(wall => `
        <div class="wall-card" style="border-right-color: ${wall.color}">
            <div class="wall-card-header">
                <div>
                    <h3>${wall.title}</h3>
                    <div class="wall-card-meta">
                        <span>📅 ${new Date(wall.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                </div>
            </div>
            <p style="color: var(--gray); margin-bottom: 1rem;">${wall.description || 'لا يوجد وصف'}</p>
            <div class="wall-card-actions">
                <a href="wall.html?slug=${wall.slug}" target="_blank" class="btn-view">👁️ عرض</a>
                <a href="submit.html?slug=${wall.slug}" target="_blank" class="btn-submit">✍️ رابط الجمع</a>
                <button onclick="openTestimonialsModal('${wall.id}')" class="btn-manage">⚙️ إدارة</button>
                <button onclick="deleteWall('${wall.id}')" class="btn-delete">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
}

// ===== إنشاء جدار =====
function openCreateModal() {
    document.getElementById('createModal').style.display = 'flex';
}

function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
}

document.getElementById('createWallForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = await getCurrentUser();
    if (!user) return;

    const slug = Math.random().toString(36).substring(2, 10);

    const { data, error } = await supabase
        .from('walls')
        .insert([{
            user_id: user.id,
            slug: slug,
            title: document.getElementById('wallTitle').value,
            description: document.getElementById('wallDesc').value,
            color: document.getElementById('wallColor').value,
            welcome_message: document.getElementById('wallWelcome').value
        }])
        .select();

    if (error) {
        alert('حدث خطأ: ' + error.message);
        return;
    }

    closeCreateModal();
    document.getElementById('createWallForm').reset();
    loadWalls();
});

// ===== حذف جدار =====
async function deleteWall(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الجدار؟')) return;

    const { error } = await supabase
        .from('walls')
        .delete()
        .eq('id', id);

    if (error) {
        alert('حدث خطأ');
        return;
    }

    loadWalls();
}

// ===== إدارة الشهادات =====
function openTestimonialsModal(wallId) {
    currentWallId = wallId;
    document.getElementById('testimonialsModal').style.display = 'flex';
    loadTestimonials(wallId);
}

function closeTestimonialsModal() {
    document.getElementById('testimonialsModal').style.display = 'none';
}

async function loadTestimonials(wallId) {
    const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('wall_id', wallId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById('testimonialsList');

    if (!testimonials || testimonials.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--gray);">لا توجد شهادات بعد</p>';
        return;
    }

    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-item">
            <div class="testimonial-item-content">
                <p>${t.content}</p>
                <div class="testimonial-item-meta">
                    <span>👤 ${t.author_name}</span>
                    <span>⭐ ${t.rating}/5</span>
                    <span class="status-badge status-${t.status}">${t.status === 'pending' ? 'قيد المراجعة' : t.status === 'approved' ? 'معتمد' : 'مرفوض'}</span>
                </div>
            </div>
            <div class="testimonial-actions">
                ${t.status !== 'approved' ? `<button onclick="updateStatus('${t.id}', 'approved')" class="btn-approve">✓ قبول</button>` : ''}
                ${t.status !== 'rejected' ? `<button onclick="updateStatus('${t.id}', 'rejected')" class="btn-reject">✕ رفض</button>` : ''}
                <button onclick="deleteTestimonial('${t.id}')" class="btn-delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function updateStatus(id, status) {
    const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);

    if (error) {
        alert('حدث خطأ');
        return;
    }

    loadTestimonials(currentWallId);
}

async function deleteTestimonial(id) {
    if (!confirm('حذف هذه الشهادة؟')) return;

    const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) {
        alert('حدث خطأ');
        return;
    }

    loadTestimonials(currentWallId);
}
