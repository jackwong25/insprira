/**
 * 草稿箱页面
 */
import { localApi } from '../api.js';
import { gotoPage } from '../navigation.js';
import { LS } from '../state.js';
import { toast } from '../components.js';
import { esc } from '../utils.js';

const MODE_LABELS = { create: '创作', rewrite: '重构', adapt: '改写' };

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return d.toLocaleDateString('zh-CN');
}

function buildDraftCard(d) {
  return `<div class="glass rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
    <div class="text-sm font-medium text-gray-200 mb-2 line-clamp-2">${esc(d.title || '无标题草稿')}</div>
    <div class="flex items-center gap-1.5 flex-wrap mb-3">
      <span class="pill !text-[10px] !py-0.5 !px-1.5 !bg-white/5 !text-gray-400">${esc(d.platform)}</span>
      <span class="pill !text-[10px] !py-0.5 !px-1.5 !bg-purple-500/20 !text-purple-300">${MODE_LABELS[d.mode] || d.mode}</span>
      <span class="text-[10px] text-gray-600 ml-auto">${formatTime(d.updated_at)}</span>
    </div>
    <div class="flex items-center gap-2">
      <button class="btn btn-ghost py-1 text-[11px] flex-1 justify-center draft-load" data-draft-id="${d.id}"><i data-lucide="pen-line" class="w-3 h-3"></i>继续编辑</button>
      <button class="btn btn-ghost py-1 px-2 text-[11px] text-gray-500 hover:text-red-400 draft-del" data-draft-id="${d.id}" title="删除"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
    </div>
  </div>`;
}

export async function renderDrafts() {
  const grid = document.getElementById('drafts-grid');
  const empty = document.getElementById('drafts-empty');
  if (!grid) return;
  try {
    const res = await localApi('drafts');
    const drafts = Array.isArray(res) ? res : (res?.data || []);
    if (!drafts.length) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    grid.innerHTML = drafts.map(buildDraftCard).join('');
    grid.querySelectorAll('.draft-load').forEach(btn => btn.addEventListener('click', () => loadToCreator(btn.dataset.draftId)));
    grid.querySelectorAll('.draft-del').forEach(btn => btn.addEventListener('click', () => deleteDraft(btn.dataset.draftId)));
    window.lucide?.createIcons(grid);
  } catch (e) {
    grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-400/60">加载失败</div>';
  }
}

async function loadToCreator(id) {
  try {
    const d = await localApi('drafts/' + id);
    if (!d || !d.id) { toast('草稿不存在', 'error'); return; }
    LS.set('draftToLoad', {
      source_text: d.source_text || '',
      generated_title: d.generated_title || '',
      generated_intro: d.generated_intro || '',
      generated_content: d.generated_content || '',
      platform: d.platform || '公众号',
      mode: d.mode || 'rewrite',
      tone: d.tone || '',
      length: d.length || 'standard',
      draftId: d.id,
    });
    toast('已加载到创作页', 'success');
    gotoPage('creator');
  } catch (e) { toast('加载失败：' + e.message, 'error'); }
}

async function deleteDraft(id) {
  if (!confirm('确定删除该草稿？')) return;
  try {
    await localApi('drafts/' + id, { method: 'DELETE' });
    toast('已删除', 'success');
    renderDrafts();
  } catch (e) { toast('删除失败', 'error'); }
}

// ========== 从创作页保存草稿（供 creator.js 调用） ==========
export async function saveDraftFromCreator() {
  const data = {
    title: document.getElementById('rewriteTitle')?.value?.trim() || '',
    source_text: document.getElementById('creatorInput')?.value?.trim() || '',
    generated_title: document.getElementById('rewriteTitle')?.value?.trim() || '',
    generated_intro: document.getElementById('rewriteIntro')?.value?.trim() || '',
    generated_content: document.getElementById('rewriteResult')?.value?.trim() || '',
    platform: document.getElementById('rewritePlatform')?.value || '公众号',
    mode: document.querySelector('.creator-mode-tab.bg-purple-500\\/20, .creator-mode-tab.text-purple-300')?.dataset?.mode || 'rewrite',
    tone: document.getElementById('rewriteTone')?.value || '',
    length: document.getElementById('rewriteLength')?.value || 'standard',
  };
  if (!data.title && !data.source_text && !data.generated_content) { toast('没有可保存的内容', 'error'); return; }
  try {
    const res = await localApi('drafts', { method: 'POST', body: data });
    toast('草稿已保存', 'success');
  } catch (e) { toast('保存失败：' + e.message, 'error'); }
}
