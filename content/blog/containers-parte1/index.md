---
title: "[Docker - parte 1] Criando containers a partir do Linux"
date: "2023-09-16T09:48:59.169Z"
description: "Utilizando cgroups, chroot e namespaces para isolamento de recursos"
---

Entrei no Programa Intensivo de Containers e Kubernetes ([PICK](https://www.linuxtips.io/pick)) do Linuxtips. Agora, aprendo kubernetes de uma vez por todas e vou me tornar especialista em containers. Umas das primeiras aulas é o entendimento de containers e a criação deles utilizando apenas recursos nativos do kernel Linux, como namespaces, cgroups e o chroot. O objetivo desse post é fazer essa simulação de container.


## o que é container?

É bem simples na verdade, containers são "caixinhas" que tem isolamento de recursos do sistema. Esses recursos podem ser memória, cpu, I/O (entrada/saída). Porém, podemos pensar também em isolamento de usuários, processos, rede, arquivos, entre outros.


### cgroups

O cgroups, control groups, é uma feature do kernel Linux que te permite isolar recursos, alocar memória, CPU, I/O, network.

![](https://wizardzines.com/images/uploads/cgroups.png)


### chroot

O chroot é utilizado para encapsular o file system, você consegue "enjaular" o usuário em um diretório específico e seus subdiretórios, em conjunto de outras ferramentas dos processos do host.

![](https://securityqueens.co.uk/wp-content/uploads/2020/04/Chroot-1.png)



### namespaces

Uma dessas outras ferramentas é o namespaces, que foi chave para criação e gerenciamento de containers. Os Namespaces isola processos pela virtualização de diversos recursos, fazendo assim com que cada container tenha sua própria instância isolada desses recursos. Os mais importantes namespaces são:

- PID namespaces
- Mount namespaces
- UTS namespaces
- Network namespaces
- IPC namespaces
- User namespaces

![](https://pbs.twimg.com/media/EJgR3NeXYAAFMaj?format=jpg&name=large)

-----
O LXC (Linux Containers) utiliza o chroot, namespaces e o cgroups para isolar os recursos. 
O Docker no começo, lá em 2015, utilizava o LXC e uns scripts por debaixo dos panos, hoje ele faz muita mais coisas do que antigamente. Vamos para a parte prática:

## isolando os recursos com namespaces e chroot

> **DISCLAIMER:** A parte prática irá utilizar um sistema baseado em debian (Ubuntu 23.04 | kernel 6.2.0), se você utilizar outra distro, os comandos podem ser diferentes. O cgroups utilizado é a [v2](https://docs.kernel.org/admin-guide/cgroup-v2.html), provavelmente os kernels mais recentes utilizam o cgroups-v2, já que foi introduzido em 2015.

Primeiramente, é necessário instalar o [debootstrap](https://wiki.debian.org/Debootstrap). Ele vai ser apenas uma ferramenta auxiliar, que ira baixar a estrutura de pasta de uma distro Linux, como debian ou ubuntu. Com isso, conseguiremos utilizar namespaces e chroot para isolar essa estrutura.

```
 sudo apt install debootstrap
 sudo debootstrap stable /home/chroot-debian http://deb.debian.org/debian
```

Agora se dermos um `ls` na pasta que baixamos os arquivos, deverá mostrar isso:

![ls chroot-debian](https://trello.com/1/cards/65058dff8f9c8797651d90a3/attachments/65058dff8f9c8797651d90cd/download/image.png)

Podemos utilizar o comando unshare para mexer com `namespaces`. Veja as opções dele, que são muitas (unshare --help). Iremos utilizar algumas, o objetivo com esse comando  é criar uma "realidade simulada" para que o usuário fique em `/home/chroot-debian` na visão do host, mas para ele será como se tivesse em `/`, a raiz de um sistema de arquivos linux com seus próprios processos, usuários, rede e etc.

```
unshare --mount --uts --ipc --net --map-root-user --user --pid --fork chroot /home/chroot-debian bash 
```
![unshare command](https://trello.com/1/cards/65058f4a376e9f7a3b46c597/attachments/65058f4a376e9f7a3b46c5c0/download/image.png)
 
 Veja que depois do commando é necessário montar o /proc, /sys e o /tmp.

 ```
 mount -t proc proc /proc
 mount -t sysfs none /sys
 mount -t tmpfs none /tmp
 ```

 Vamos entender o que essas opções do unshare está fazendo:

* `--mount` - unshare mounts namespace (cada container é dono do seu ponto de montagem, isola os processos em um mnt namespace)
* `--uts`  - unshare UTS namespace (isolamento de hostname, versão de SO, etc)
* `--ipc` - unshare System V IPC namespace (isola o SystemV IPC)
* `--net` - unshare network namespace (cada container possuiu sua interface de redes)
* `--map-root-user` - mapeia o usuário atual para root (precisa do --user)
* `--user` - unshare user namespace (mapa de identificação do usuário em cada container)
* `--pid` - unshare pid namespace (cada container tenha sua identificação de processo)
* `--fork`  -  fork antes do lançamento <programa>
* `chroot /home/chroot-debian` - enjaula nesse diretório o usuário
* `bash` - vai entrar como bash nesse isolamento

Nessa parte, utilizamos os namespaces e chroot para criar nosso isolamento. Agora, iremos utilizar o cgroups para fazer a limitação de recursos, e assim o container estará completo.

## limitação de recursos com cgroup

Precisamos instalar o `cgroup-tools` para manipular o cgroups, apesar de já estar no linux, não conseguimos interagir com ele por padrão, então usamos essa ferramenta. Logo mais iremos precisar do `htop` para visualizar a limitação dos recursos. 

Abra outra aba do terminal e digite os comandos:

```
sudo apt install cgroup-tools htop
sudo cgcreate -g cpu,memory:mazoni
ls /sys/fs/cgroup/mazoni
```

Esse comando cria os cgroups com os parâmetros que mandamos, no final depois dos dois pontos é o nome do grupo. Será criado um diretório `mazoni` no cgroups, e dentro terá todos os arquivos de configuração dos _controllers_ que passei, no caso cpu e memória.

Use o comando `ps -ef` e pegue o PID do processo do bash rodando no unshare. Iremos mapear esse PID com todas as regras do controllers que criamos.

![bash PID](https://trello.com/1/cards/650594bbc22bf20f3260ce12/attachments/650594bbc22bf20f3260ce3b/download/image.png)

```
sudo cgclassify -g cpu,memory:mazoni 24805
cat /sys/fs/cgroup/mazoni/cgroup.procs
# 24805
```

Podemos colocar qual a quantidade máxima de cpu que o nosso container consegue utilizar. Manipulando os arquivos `cpu.max`.  

```
cat /sys/fs/cgroup/mazoni/cpu.max
# max 100000

```

Caso eu queira limitar para 20% da cpu e o máximo é 100000, então iremos colocar 20000 na cota.

```
sudo cgset -r cpu.max=20000 mazoni
cat /sys/fs/cgroup/mazoni/cpu.max
# 20000 100000
```

Hora de testar a limitação da cpu em nosso container, a melhor forma seria utilizando a biblioteca `stress` que é proprio para isso, só que vamos utilizar algo nativo do linux: `dd`.

Abra o `htop` nesse terminal e vá para aba do container e utilize o comando:

```
dd if=/dev/zero bs=8k count=256k
```

Volte para a outra aba, iremos acompanhar a porcentagem de CPU utilizada do comando e vai ficar entre 19% e 21%.

![image do htop](https://trello.com/1/cards/65059d38fbcd06d7accafe33/attachments/65059d38fbcd06d7accafe5e/download/image.png)

Podemos limitar a memória também, dê `CTRL+C` para sair do htop e dê o comando:

```
ls /sys/fs/cgroup/mazoni
```

![ls cgroup mazoni](https://trello.com/1/cards/65059ea64b0a688840c9bec4/attachments/65059ea64b0a688840c9befc/download/image.png)

Como você pode ver, `memory.max` vai atuar da mesma forma que o do cpu.

```
sudo cgset -r memory.max=48M mazoni
```

O comando `dd` não utiliza muita memória, ficando difícil de testar.

---
Para pegarmos o valores dos controles dos grupos, ao invés de ficar dando `cat` nos arquivos, tem o comando `cgget`:

```
cgget -r memory.peek mazoni
cgget -r memory.max mazoni
```

![cgget exemplo](https://trello.com/1/cards/6505a091cecf4c54335b0f4a/attachments/6505a091cecf4c54335b0f76/download/image.png)

## Conclusão

Com isso, tivemos um apanhado geral de como funciona o isolamento feito no Linux, com ferramentas nativas: `namespaces`, `chroot` e `cgroups`. O Docker por debaixo dos panos utiliza esses caras para fazer o isolamento, é claro que com o passar do tempo ele foi se sofisticando e tendo mais funcionalidades, porêm a base é isso.

> Containers são isolamento de recursos.
>
> by Vitalino, Jeferson Fernando


### Fontes

https://www.linuxtips.io/course/descomplicando-docker

https://wizardzines.com/

https://www.redhat.com/sysadmin/mount-namespaces

https://access.redhat.com/documentation/pt-br/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/setting-cpu-limits-to-applications-using-cgroups-v2_using-control-groups-through-a-virtual-file-system