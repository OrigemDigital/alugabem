/* =========================================================
   AlugaBem — dados dos imóveis e interações
   Para trocar as fotos: coloque os arquivos na pasta "img"
   com os mesmos nomes listados em "fotos" (ou altere os nomes).
   ========================================================= */

const imoveis = [
  {
    id: 1, tipo: "casa", titulo: "Casa no Centro", preco: 1800,
    quartos: 3, banheiros: 2, area: 120,
    local: "Centro, Várzea Alegre - CE", etiqueta: "Para alugar",
    descricao: "Casa de dois andares em condomínio fechado, com jardim na frente, sala aconchegante e cozinha compacta. Ideal para famílias!",
    fotos: ["img/casa-centro-1.jpg", "img/casa-centro-2.jpg", "img/casa-centro-3.jpg"]
  },
  {
    id: 2, tipo: "casa", titulo: "Casa Jardim Aeroporto", preco: 1500,
    quartos: 3, banheiros: 2, area: 90,
    local: "Jardim Aeroporto, Várzea Alegre - CE", etiqueta: "Novo valor",
    descricao: "Casa com garagem coberta, sala integrada à cozinha e iluminação aconchegante, em rua tranquila e bem localizada.",
    fotos: ["img/casa-jardim-aeroporto-1.jpg", "img/casa-jardim-aeroporto-2.jpg", "img/casa-jardim-aeroporto-3.jpg"]
  },
  {
    id: 3, tipo: "casa", titulo: "Casa Bairro Alto", preco: 2800,
    quartos: 3, banheiros: 3, area: 160,
    local: "Bairro Alto, Várzea Alegre - CE", etiqueta: "Destaque",
    descricao: "Casa moderna de dois andares, com varanda, garagem e acabamento de alto padrão. Sala ampla com painel de TV e cozinha com ilha, perfeita para receber.",
    fotos: ["img/casa-bairro-alto-1.jpg", "img/casa-bairro-alto-2.jpg", "img/casa-bairro-alto-3.jpg"]
  },
  {
    id: 4, tipo: "casa", titulo: "Casa Vila Nova", preco: 1100,
    quartos: 2, banheiros: 1, area: 80,
    local: "Vila Nova, Várzea Alegre - CE", etiqueta: "Para alugar",
    descricao: "Casa térrea simples e bem cuidada, com varanda para rede, sala arejada e banheiro com box. Ótima para casais ou pequenas famílias.",
    fotos: ["img/casa-vila-nova-1.jpg", "img/casa-vila-nova-2.jpg", "img/casa-vila-nova-3.jpg"]
  }
];

/* ---------- Utilitários ---------- */
const $ = (s, el = document) => el.querySelector(s);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const norm = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Quando a foto ainda não existe, mostra um quadro azul com a casa da logo
const ICONE_PH = '<svg viewBox="0 0 100 100"><use href="#logo-casa"/></svg>';
window.fotoAusente = function (img) {
  const ph = document.createElement("div");
  ph.className = "ph";
  ph.innerHTML = ICONE_PH;
  img.replaceWith(ph);
};
const tagImg = (src, alt) =>
  `<img src="${src}" alt="${alt}" loading="lazy" onerror="fotoAusente(this)">`;

const ICONE_CORACAO = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

/* ---------- Favoritos (guardados no navegador) ---------- */
let favoritos = [];
try { favoritos = JSON.parse(localStorage.getItem("alugabem-fav")) || []; } catch (e) { favoritos = []; }
const salvarFav = () => { try { localStorage.setItem("alugabem-fav", JSON.stringify(favoritos)); } catch (e) {} };

/* ---------- Lista de imóveis ---------- */
let filtro = "todos";
let termo = "";

function renderizar() {
  const grade = $("#grade");
  const lista = imoveis.filter((i) => {
    const okTipo = filtro === "todos" || (filtro === "favoritos" ? favoritos.includes(i.id) : i.tipo === filtro);
    const okBusca = !termo || norm(i.local).includes(termo) || norm(i.titulo).includes(termo);
    return okTipo && okBusca;
  });

  grade.innerHTML = lista.map((i) => `
    <article class="card" data-id="${i.id}" tabindex="0" role="button" aria-label="Ver detalhes: ${i.titulo}">
      <div class="card-foto">
        ${tagImg(i.fotos[0], i.titulo)}
        <span class="etiqueta">${i.etiqueta}</span>
        <button class="coracao ${favoritos.includes(i.id) ? "ativo" : ""}" data-fav="${i.id}"
          aria-label="Favoritar ${i.titulo}" aria-pressed="${favoritos.includes(i.id)}">
          ${ICONE_CORACAO}
        </button>
      </div>
      <div class="card-corpo">
        <h3>${i.titulo}</h3>
        <p class="card-local">${i.local}</p>
        <p class="card-preco">${brl(i.preco)}<small>/mês</small></p>
        <div class="card-specs">
          <span>${i.quartos} quarto${i.quartos > 1 ? "s" : ""}</span>
          <span>${i.banheiros} banheiro${i.banheiros > 1 ? "s" : ""}</span>
          <span>${i.area} m²</span>
        </div>
      </div>
    </article>`).join("");

  $("#vazio").hidden = lista.length > 0;
}

$("#filtros").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("ativo"));
  btn.classList.add("ativo");
  filtro = btn.dataset.filtro;
  renderizar();
});

$("#busca").addEventListener("input", (e) => { termo = norm(e.target.value.trim()); renderizar(); });

$("#grade").addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    e.stopPropagation();
    const id = Number(fav.dataset.fav);
    favoritos = favoritos.includes(id) ? favoritos.filter((f) => f !== id) : [...favoritos, id];
    salvarFav();
    mostrarToast(favoritos.includes(id) ? "Adicionado aos favoritos" : "Removido dos favoritos");
    renderizar();
    return;
  }
  const card = e.target.closest(".card");
  if (card) abrirModal(Number(card.dataset.id));
});
$("#grade").addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("card")) {
    e.preventDefault();
    abrirModal(Number(e.target.dataset.id));
  }
});

/* ---------- Modal de detalhes ---------- */
const modal = $("#modal");
let atual = null;

function abrirModal(id) {
  atual = imoveis.find((i) => i.id === id);
  if (!atual) return;
  $("#mTitulo").textContent = atual.titulo;
  $("#mPreco").innerHTML = `${brl(atual.preco)}<small>/mês</small>`;
  $("#mSpecs").innerHTML = `
    <li>${atual.quartos} quarto${atual.quartos > 1 ? "s" : ""}</li>
    <li>${atual.banheiros} banheiro${atual.banheiros > 1 ? "s" : ""}</li>
    <li>${atual.area} m²</li>`;
  $("#mLocal").textContent = atual.local;
  $("#mDesc").textContent = atual.descricao;
  $("#mMinis").innerHTML = atual.fotos.map((f, n) =>
    `<button class="mini ${n === 0 ? "ativo" : ""}" data-n="${n}" aria-label="Foto ${n + 1}">${tagImg(f, atual.titulo + " - foto " + (n + 1))}</button>`
  ).join("");
  trocarFoto(0);
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $(".modal-fechar").focus();
}

function trocarFoto(n) {
  $("#mFoto").innerHTML = tagImg(atual.fotos[n], atual.titulo + " - foto " + (n + 1));
  document.querySelectorAll(".mini").forEach((m, i) => m.classList.toggle("ativo", i === n));
}

function fecharModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

$("#mMinis").addEventListener("click", (e) => {
  const mini = e.target.closest(".mini");
  if (mini) trocarFoto(Number(mini.dataset.n));
});
modal.addEventListener("click", (e) => { if (e.target.closest("[data-fechar]")) fecharModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) fecharModal(); });

$("#mContato").addEventListener("click", () => {
  fecharModal();
  $("#mensagem").value = `Olá! Tenho interesse no imóvel "${atual.titulo}" (${brl(atual.preco)}/mês).`;
  document.getElementById("contato").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#nome").focus({ preventScroll: true }), 600);
});

/* ---------- Formulário de contato (demonstração) ---------- */
$("#formContato").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = $("#nome"), info = $("#contatoInfo"), aviso = $("#formAviso");
  [nome, info].forEach((c) => c.classList.remove("erro"));
  let ok = true;
  if (!nome.value.trim()) { nome.classList.add("erro"); ok = false; }
  if (!info.value.trim()) { info.classList.add("erro"); ok = false; }
  if (!ok) { aviso.textContent = "Preencha seu nome e um contato para continuar."; return; }
  aviso.textContent = `Obrigado, ${nome.value.trim().split(" ")[0]}! Recebemos sua mensagem (demonstração).`;
  e.target.reset();
});

/* ---------- Menu mobile ---------- */
const menu = $("#menu"), menuBtn = $("#menuBtn");
menuBtn.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", aberto);
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") { menu.classList.remove("aberto"); menuBtn.setAttribute("aria-expanded", "false"); }
});

/* ---------- Aviso rápido ---------- */
let tToast;
function mostrarToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("mostra");
  clearTimeout(tToast);
  tToast = setTimeout(() => t.classList.remove("mostra"), 1800);
}

renderizar();
