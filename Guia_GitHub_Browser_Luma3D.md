# GUIA — Meter o Luma 3D ERP Online
## Só pelo browser — sem Terminal, sem instalações

---

# PASSO 1: Criar repositório no GitHub (2 min)

1. Abre: **https://github.com/new**
2. Se não estiveres logged in, faz login
3. Preenche:
   - **Repository name:** `luma3d-erp`
   - **Description:** `ERP de gestão — Luma 3D`
   - **Visibilidade:** Marca **Public** (necessário para Vercel gratuito)
   - ✅ Marca **"Add a README file"**
4. Clica **"Create repository"**
5. Estás agora na página do teu repositório 🎉


---

# PASSO 2: Fazer upload do index.html (1 min)

1. Na página do repositório, clica no botão **"Add file"** → **"Upload files"**
2. Arrasta o ficheiro **index.html** (que descarregaste do Claude) para a área de upload
3. Em "Commit changes", escreve: `Luma 3D ERP v1.0`
4. Clica **"Commit changes"**
5. O ficheiro aparece no repositório 🎉


---

# PASSO 3: Ativar GitHub Pages (2 min)

1. No repositório, clica em **"Settings"** (ícone engrenagem, menu topo)
2. No menu lateral esquerdo, clica em **"Pages"**
3. Em **"Source"**, seleciona:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Clica **"Save"**
5. Espera 1-2 minutos
6. Atualiza a página — aparece o URL:

   **https://TEU-USERNAME.github.io/luma3d-erp/**

7. Clica no URL — o ERP está online! 🎉

⚠️ Se aparecer o README em vez do ERP, espera mais 2-3 minutos 
e atualiza de novo. O GitHub Pages demora um bocado na primeira vez.


---

# MÉTODO ALTERNATIVO: Vercel (mais rápido e fiável)

Se preferires Vercel em vez de GitHub Pages:

1. Abre: **https://vercel.com**
2. Clica **"Sign Up"** → **"Continue with GitHub"**
3. Autoriza o Vercel
4. No dashboard, clica **"Add New..."** → **"Project"**
5. Procura **"luma3d-erp"** na lista e clica **"Import"**
6. Em **"Framework Preset"**, seleciona **"Other"**
7. Clica **"Deploy"**
8. Espera 30 segundos...
9. **PRONTO!** 🎉 URL tipo:

   **https://luma3d-erp.vercel.app**


---

# PASSO 4: Abrir no telemóvel

1. Abre o URL no Safari/Chrome do telemóvel
2. **No iPhone:** clica no ícone de partilhar (□↑) → **"Adicionar ao ecrã inicial"**
3. **No Android:** clica nos 3 pontos → **"Adicionar ao ecrã inicial"**
4. Agora tens o ERP como uma app no teu telemóvel! 📱


---

# COMO ATUALIZAR NO FUTURO

Quando quiseres atualizar o ERP (por exemplo, com uma versão nova que eu te dê):

1. Vai ao teu repositório: `github.com/TEU-USERNAME/luma3d-erp`
2. Clica no ficheiro **index.html**
3. Clica no ícone do **lápis** (✏️) no canto superior direito → **"Edit this file"**
4. Seleciona TUDO (Ctrl+A / Cmd+A) e apaga
5. Cola o conteúdo novo do index.html
6. Clica **"Commit changes"** → **"Commit changes"**
7. Espera 1-2 minutos — o site atualiza automaticamente


---

# PERGUNTAS FREQUENTES

**O site está lento a carregar**
→ Normal na primeira vez. O Babel compila o React no browser. 
  Demora 2-3 segundos. Depois fica em cache e é rápido.

**Perdi os dados — onde ficam?**
→ Os dados ficam no localStorage do TEU browser. Se mudares de 
  browser ou limpares cache, perdes os dados. Cada dispositivo 
  (computador, telemóvel) tem dados separados.

**Posso usar no telemóvel e computador ao mesmo tempo?**
→ Sim, mas os dados NÃO sincronizam entre dispositivos. Cada um 
  tem os seus dados independentes.

**O GitHub Pages não funciona**
→ Vai a Settings → Pages → verifica se o branch é "main" e a 
  pasta é "/ (root)". Espera 5 minutos e atualiza.

**Quero que seja privado**
→ No GitHub, vai a Settings → General → "Change visibility" → 
  Private. Mas o GitHub Pages gratuito só funciona com repos 
  públicos. Para privado, usa o Vercel (funciona com repos privados).
