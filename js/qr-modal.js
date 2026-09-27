/**
 * MODULE MODAL TRUY XUẤT NGUỒN GỐC MÃ QR
 */

function openQrModal(id) {
  const data = TRACE_DATABASE[id] || TRACE_DATABASE['TAN-TRIEU-01'];
  
  const modalCode = document.getElementById('qrModalCode');
  const modalOwner = document.getElementById('qrModalOwner');
  const modalLocation = document.getElementById('qrModalLocation');
  const modalStandard = document.getElementById('qrModalStandard');
  const modalImg = document.getElementById('qrModalImg');
  const timelineContainer = document.getElementById('qrTimelineContainer');
  const modal = document.getElementById('qrModal');

  if (modalCode) modalCode.innerText = data.code;
  if (modalOwner) modalOwner.innerText = data.owner;
  if (modalLocation) modalLocation.innerText = data.location;
  if (modalStandard) modalStandard.innerText = data.standard;
  if (modalImg) modalImg.src = data.qrUrl;

  if (timelineContainer && data.timeline) {
    timelineContainer.innerHTML = data.timeline.map(item => `
      <div>
        <div class="text-[11px] text-stone-400 font-medium">${escapeHtml(item.time)}</div>
        <div class="text-stone-700 font-medium">${escapeHtml(item.desc)}</div>
      </div>
    `).join('');
  }

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeQrModal() {
  const modal = document.getElementById('qrModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}
