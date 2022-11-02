---
title: Configurando Crostini para desenvolvimento
date: "2019-04-13T22:20:03.284Z"
description: "Instalação inicial do Linux container: 'Crostini'"
---

Primeiramente vamos fazer o update e upgrade do sistema. Lembrando que o Crostini é um container Linux (LXC) baseado em Debian.

    sudo apt update && sudo apt upgrade

Agora, vamos instalar alguns pré-requisitos para compilar o código fonte dessas aplicações no Crostini, como o _python_ e o _vim_:

    sudo apt install -y clang make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev

### Python

Primeiramente vou instalar o `python3.7`, compilando o código-fonte, pois o python3 padrão do repositório Debian não funcionou o _jupyter notebook_.

> A versão do python que for instalado pode ser facilmente alterado, mudando nas instruções abaixo o número da versão. Ao invés de ser `3.7.2` poderia muito bem ser `3.6.5` (ou qualquer outro), o primeiro comando ficaria: "wget https://www.python.org/ftp/python/3.6.5/Python-3.6.5.tgz" e assim por diante.

    wget https://www.python.org/ftp/python/3.7.2/Python-3.7.2.tgz
    tar xzf Python-3.7.2.tgz
    cd Python-3.7.2
    ./configure --enable-optimizations
    make
    sudo make install
    cd ..
    sudo rm -rf Python-3.7.2

### Vim

Como o python, iremos compilar também o vim para habilitar o interpretador.

    sudo apt remove vim
    git clone https://github.com/vim/vim.git
    cd vim
    ./configure --with-features=huge \
        --enable-multibyte \
        --enable-python3interp=yes \	    --with-python3-config-dir=/usr/local/lib/python3.7/config-3.7m-x86_64-linux-gnu/ \
        --enable-gui=gtk2 \
        --enable-cscope \
        --prefix=/usr/local \
        --with-tlib=ncurses
    make VIMRUNTIMEDIR=/usr/share/vim/vim80
    sudo make altinstall
    cd ..
    rm -rf vim

Existem vários gerenciadores de plugins do vim, o que utilizo é o _Vundle_.

    git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim

É preciso criar um arquivo .vimrc para colocar as configurações do vim, se quiser utilizar as [minhas configurações](https://github.com/MMazoni/configuration-files/blob/master/.vimrc).

### Fish

Eu comecei utilizar o `fish` por causa de uma vídeo aula em que o instrutor usava, o autocomplete dele é muito bom, ele é bem leve e não precisa quase de configuração, diferente do _zsh_ que é o mais famoso e utilizado por programadores, por sua alta customização e variedade de plugins. Eles são uma alternativa ao padrão _bash_:

    sudo apt install fish
    which fish

Pegue o que retornou desse comando, normalmente `/usr/bin/fish`, e coloque no lugar onde esteja o `/bin/bash` na linha do seu **username** no arquivo `passwd`.

    sudo vim /etc/passwd

### Node-js

Iremos baixar do site oficial a versão 10.16.0 LTS.

    wget https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-x64.tar.xz
    mkdir .nodejs
    tar -xJvf node-v10.16.0-linux-x64.tar.xz -C ~/.nodejs

Precisamos adicionar a pasta `.nodejs/bin` como PATH(lembrando que vou mostrar com os comandos do fish, se você usar o bash ou zsh, é diferente):

    echo "set -x PATH ~/.nodejs/node-v10.16.0-linux-x64/bin $PATH" >> ~/.config/fish/config.fish
    source ~/.config/fish/config.fish

### Python Modules

Algumas bibliotecas do python que utilizo no meu estudo de `data science`:

    pip3 install --upgrade pip --user
    pip3 install jupyter pandas matplotlib numpy scikit-learn scipy --user
