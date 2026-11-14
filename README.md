# Matheus Mazoni Blog

Blog pessoal onde escrevo sobre Automação, DevOps e Desenvolvimento.

Migrado de Gatsby.js para **[Hugo](https://gohugo.io/)**.

## 💻 Pré-requisitos

Para rodar localmente, você precisa apenas do binário do **Hugo** (versão Extended recomendada):

- No Linux (Debian/Ubuntu/Pop!_OS):
  ```bash
  sudo apt install hugo
  # Ou baixe a versão extended do GitHub Releases
  ```
- No macOS (Homebrew):
  ```bash
  brew install hugo
  ```
- No Windows (Winget/Scoop/Choco):
  ```bash
  winget install Hugo.Hugo.Extended
  ```

> Neste workspace, o binário do Hugo já está disponível em `./bin/hugo`.

## ☕ Rodar o blog localmente

Inicie o servidor de desenvolvimento com live-reload:

```bash
hugo server -D
# ou usando o binário local:
./bin/hugo server -D
```

Acesse em `http://localhost:1313/`.

## 📦 Build para produção

Para gerar os arquivos estáticos em `./public`:

```bash
hugo --gc --minify
# ou:
./bin/hugo --gc --minify
```

## 🚀 CI/CD com GitHub Actions

O deploy para o **GitHub Pages** é feito de forma 100% automatizada a cada push na branch `master` através do workflow em [`.github/workflows/hugo.yml`](.github/workflows/hugo.yml).

### Configuração no GitHub:
1. No repositório, vá em **Settings** > **Pages**.
2. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
3. O workflow fará o build com Hugo Extended e deploy direto no GitHub Pages em segundos.
