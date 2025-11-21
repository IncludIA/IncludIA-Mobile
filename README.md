

````markdown
# 🚀 Includ.IA - Mobile

> **O Futuro do Trabalho é Inclusivo.**

![Banner](https://via.placeholder.com/1200x300?text=Includ.IA+Mobile+App)

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## 💡 Sobre o Projeto

Desenvolvido para a **Global Solution 2025 (FIAP)**, o **Includ.IA** é uma plataforma revolucionária que utiliza Inteligência Artificial para eliminar vieses inconscientes nos processos de recrutamento.

O aplicativo móvel oferece uma experiência **Dual Persona** (B2C e B2B), conectando talentos invisíveis a empresas que valorizam a diversidade real, através de um sistema de *Matching* inteligente e currículos cegos (Blind Recruitment).

---

## 📱 Funcionalidades

O aplicativo adapta-se automaticamente dependendo do tipo de usuário logado:

### 👤 Para Candidatos
* **Gamificação de Perfil:** Barra de progresso que incentiva o preenchimento completo do currículo.
* **Feed de Vagas (Swipe):** Interface intuitiva estilo "Tinder" para aplicar ou descartar vagas.
* **Smart Match:** Algoritmo que calcula a % de compatibilidade baseada em Skills.
* **Chat em Tempo Real:** Comunicação direta com recrutadores após o Match.
* **IA Profile:** Resumo de perfil gerado por IA focado em *soft skills*.

### 💼 Para Recrutadores
* **Dashboard de Gestão:** Visão geral das vagas abertas, candidatos e métricas.
* **Publicação de Vagas:** Formulário assistido por IA para descrições inclusivas.
* **Feed de Talentos:** Busca ativa de candidatos compatíveis com a vaga.
* **Análise de Perfil:** Visualização estruturada de currículos.

### ⚙️ Funcionalidades Comuns
* **Segurança:** Autenticação JWT, Proteção de Rotas e LGPD (Solicitação de Dados e Exclusão de Conta).
* **Configurações:** Modo Escuro/Claro, Notificações e Privacidade.

---

## 🛠 Tecnologias & Arquitetura

O projeto foi construído seguindo os princípios de **Clean Architecture** e **Solid**, garantindo escalabilidade.

* **Core:** React Native com Expo (Managed Workflow).
* **Linguagem:** TypeScript (Tipagem estática estrita).
* **Navegação:** React Navigation (Bottom Tabs + Native Stack + Nested Navigators).
* **Estado Global:** Context API (`AuthContext`, `ThemeContext`).
* **API Client:** Axios com Interceptors para injeção automática de Token.
* **Persistência:** Expo SecureStore (Tokens) e AsyncStorage (Cache/Preferências).

### Estrutura de Pastas
```bash
src/
├── context/       # Estados globais (Auth, Theme)
├── navigation/    # Estratégia de navegação (Candidate vs Recrutador)
├── screens/
│   ├── app/
│   │   ├── candidate/  # Telas exclusivas do Candidato
│   │   ├── recruiter/  # Telas exclusivas do Recrutador
│   │   ├── config/     # Telas de Configuração (LGPD, Security)
│   │   └── chat/       # Telas de Chat (Compartilhadas)
│   └── auth/           # Login, Register, Welcome
├── services/      # API, Notificações
└── ...
````

-----

## 🚀 Como Rodar o Projeto

### Pré-requisitos

  * Node.js instalado.
  * Dispositivo físico (Android/iOS) com o app **Expo Go** ou Emulador configurado.
  * Backend Java (API) rodando localmente.

### Passo a Passo

1.  **Clone o repositório e instale as dependências:**

    ```bash
    npm install
    ```

2.  **Configure o IP da API:**
    Abra o arquivo `src/services/api.ts` e altere o `baseURL` para o IP da sua máquina local (não use `localhost` se estiver no celular físico).

    ```typescript
    // Exemplo:
    const baseURL = '[http://192.168.1.15:8080](http://192.168.1.15:8080)';
    ```

3.  **Execute o projeto:**

    ```bash
    npx expo start
    ```

4.  **Acesse:**

      * Pressione `a` para abrir no Android Emulator.
      * Pressione `i` para abrir no iOS Simulator.
      * Ou escaneie o QR Code com o app **Expo Go** no seu celular.

-----

## 🎥 Demonstração

Confira o vídeo completo da solução em funcionamento:

[](https://www.google.com/search?q=https://www.youtube.com/watch%3Fv%3DVIDEO_ID_AQUI)

*(Clique na imagem para assistir)*

-----

## 👥 Integrantes do Grupo

