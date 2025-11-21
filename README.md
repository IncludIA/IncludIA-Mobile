# 🧠 Includ.IA - Cognitive Engine (Microserviço de IA)

> 🚀 **Global Solution 2025 - O Futuro do Trabalho**
>
> 🎓 *Disruptive Architectures: *Mobile*

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

</div>

## 📑 Índice

1.  [🌐 Links e Demonstração](#-links-e-demonstração)
2.  [💡 Sobre o Projeto](#-sobre-o-projeto)
3.  [📱 Funcionalidades e Telas](#-funcionalidades-e-telas)
    * [Fluxo de Autenticação](#-fluxo-de-autenticação)
    * [Área do Candidato](#-área-do-candidato)
    * [Área do Recrutador](#-área-do-recrutador)
    * [Funcionalidades Comuns](#-funcionalidades-comuns)
4.  [🛠 Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
5.  [🚀 Como Rodar o Projeto](#-como-rodar-o-projeto)
6.  [👥 Integrantes](#-integrantes)
7.  [📄 Licença](#-licença)

---

## 🌐 Links e Demonstração

<div align="center">

[![Pitch](https://img.shields.io/badge/🎬%20Vídeo-Pitch-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/SEU_LINK_PITCH)
[![Demo](https://img.shields.io/badge/📺%20Demo-Técnica-212121?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/SEU_LINK_DEMO)

</div>

---

## 💡 Sobre o Projeto

Desenvolvido para a **Global Solution 2025 (FIAP)**, o **Includ.IA** é uma plataforma revolucionária que utiliza Inteligência Artificial para eliminar vieses inconscientes nos processos de recrutamento.

O aplicativo móvel oferece uma experiência **Dual Persona** (B2C e B2B), conectando talentos invisíveis a empresas que valorizam a diversidade real, através de um sistema de *Matching* inteligente e currículos cegos (Blind Recruitment).

---

## 📱 Funcionalidades e Telas

O aplicativo adapta-se automaticamente dependendo do tipo de usuário logado (Candidato ou Recrutador).

### 🔐 Fluxo de Autenticação
* **Welcome Screen:** Tela de boas-vindas animada com a proposta de valor.
* **Login:** Acesso seguro com JWT. Possui botões de **Demo Rápido** para testar como Candidato ou Recrutador sem cadastro.
* **Cadastro:** Fluxo inteligente onde o usuário escolhe seu perfil. Se for recrutador, o sistema cria automaticamente uma empresa para facilitar o teste.

### 👤 Área do Candidato
Focada na experiência do usuário que busca emprego.
* **Home (Feed de Vagas):** Interface estilo "Swipe" (Tinder). O candidato vê cards de vagas compatíveis, pode dar Like (candidatar-se) ou Dislike.
* **Detalhes da Vaga:** Tela rica com descrição, benefícios, salário e análise de compatibilidade gerada por IA.
* **Perfil Pessoal Gamificado:** Uma barra de progresso incentiva o preenchimento completo do currículo (Skills, Experiência, Educação).
* **Edição de Perfil:** Interface intuitiva para adicionar habilidades (tags), experiências e resumo profissional.

### 💼 Área do Recrutador
Focada na gestão de processos seletivos.
* **Dashboard:** Visão geral das vagas abertas, número de candidatos e matches.
* **Publicar Vaga:** Formulário assistido para criar novas oportunidades.
* **Feed de Talentos:** O recrutador vê candidatos compatíveis com sua vaga e pode dar "Match".
* **Perfil do Candidato:** Visualização do currículo do candidato (com opção de anonimização inicial).
* **Perfil da Empresa:** Gestão da marca empregadora (Cultura, Descrição).

### ⚙️ Funcionalidades Comuns
* **Matches:** Lista de conexões bem-sucedidas.
* **Chat em Tempo Real:** Troca de mensagens entre candidato e recrutador após o Match.
* **Configurações:**
    * **LGPD:** Solicitação de exportação de dados.
    * **Segurança:** Alteração de senha, Exclusão de conta e 2FA (Simulado).
    * **Jurídico:** Termos de Uso e Políticas de Privacidade.

---

## 🛠 Arquitetura e Tecnologias

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
2.  **Execute o projeto:**

    ```bash
    npx expo start
    ```

3.  **Acesse:**

      * Pressione `a` para abrir no Android Emulator.
      * Pressione `i` para abrir no iOS Simulator.
      * Ou escaneie o QR Code com o app **Expo Go** no seu celular.


-----


## 👥 Integrantes

  * **RM 555213** - Luiz Eduardo Da Silva Pinto



