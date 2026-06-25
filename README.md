# 🚀 Gestão de TCCs

## 📌 Sobre o Projeto

O **Gestão de TCCs** é um sistema web desenvolvido para a disciplina de **Programação Web (GAC116)** da Universidade Federal de Lavras (UFLA).

O projeto consiste em uma plataforma para gerenciamento de Trabalhos de Conclusão de Curso (TCC), Alunos e Professores. O backend foi pré-desenvolvido utilizando Django REST Framework (DRF), e a interface web foi construída para consumir essa API e oferecer uma experiência completa de gerenciamento e visualização de dados acadêmicos.

---

# ✨ Funcionalidades Implementadas

## 🎓 Gerenciamento Acadêmico

* Listagem e busca de alunos.
* Listagem e busca de professores.
* Listagem e busca de cursos.
* Listagem e busca de departamentos.
* Listagem e busca de unidades acadêmicas.

---

## 📄 Gestão de Trabalhos

* Cadastramento de novos TCCs.
* Upload de arquivos PDF do trabalho (via `multipart/form-data`).
* Interface para alteração de status do TCC:
  * `0`: Em Elaboração
  * `1`: Enviado
  * `2`: Aprovado
  * `3`: Reprovado
* Visualização e download de arquivos PDF diretamente na listagem.

---

## 📊 Dashboard de Estatísticas

* Tela interativa consumindo o endpoint de estatísticas da API.
* Exibição visual de dados (Total geral de TCCs, divisão por status e contagem por orientador).
* *Nota: O sistema não necessita de controle de permissões ou login.*

---

# 🔗 API REST

A aplicação possui comunicação via API REST utilizando Django REST Framework.

### Endpoints consumidos

* **Unidades Acadêmicas:** `http://127.0.0.1:8000/api/unidades-academicas/`
* **Departamentos:** `http://127.0.0.1:8000/api/departamentos/`
* **Cursos:** `http://127.0.0.1:8000/api/cursos/`
* **Alunos:** `http://127.0.0.1:8000/api/alunos/`
* **Professores:** `http://127.0.0.1:8000/api/professores/`
* **TCCs:** `http://127.0.0.1:8000/api/tccs/`
* **Estatísticas:** `http://127.0.0.1:8000/api/tccs/estatisticas/`

---

# 🎨 Frontend

Interface desenvolvida utilizando tecnologias modernas para garantir alta performance e fluidez:

* Next.js
* React
* TypeScript
* Tailwind CSS

---

# 🏗️ Arquitetura do Sistema
```
Frontend (Next.js)
        ↓
API REST (Django REST Framework)
        ↓
PostgreSQL
```
Toda a infraestrutura do projeto é conteinerizada utilizando **Docker**, garantindo a padronização e o isolamento dos ambientes de desenvolvimento.

---

# 🗄️ Modelagem do Banco de Dados

O sistema utiliza **PostgreSQL** externo ao Django como banco de dados relacional.

## Principais Entidades

### Alunos e Professores
Registros dos discentes e docentes da instituição.

### Cursos, Departamentos e Unidades Acadêmicas
Estrutura organizacional da universidade.

### TCC
Entidade central que relaciona o aluno, o professor orientador, o arquivo do trabalho e o seu status atual.

---

# 🛠️ Tecnologias Utilizadas

## Frontend
* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend
* Django
* Django REST Framework

## Banco de Dados
* PostgreSQL

## DevOps
* Docker
* Docker Compose

---

# 📂 Estrutura do Projeto
```
gestao-tccs/
│
├── backend/
│   ├── core/
│   ├── tcc_project/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── load.py
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
└── docker-compose.yml
```
---

# 🐳 Como Executar o Projeto

## Pré-requisitos
* Docker Desktop
* Git (opcional)

---

## Subir os Containers
Na raiz do projeto, execute o comando para construir e inicializar os serviços (banco de dados, backend e frontend):
```
docker compose up --build
```
---

## Executar Configurações do Banco
Abra outro terminal e acesse o container do backend:
```
docker compose exec backend bash
```
Gere e aplique as migrações:
```
python manage.py makemigrations core
python manage.py migrate
```
---

## Popular Dados Iniciais
Ainda no container do backend, execute o script para popular o banco de dados:
```
python load.py
```
---

# 🌐 Acessos

## Frontend (Aplicação Web)
http://localhost:3000

## Backend (API REST)
http://localhost:8000/api/

---

# 👥 Equipe

* Samuel Vanoni
* João
* Daniel

Universidade Federal de Lavras (UFLA)
Disciplina: Programação Web (GAC116)
Professor: Raphael

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos na disciplina de Programação Web da UFLA.