# ecologiate-api

1) Instalar git:
https://git-scm.com/

2) Bajarse el proyecto:
"git clone git@github.com:ecologiate/ecologiate-api.git"

Si no funciona por permisos, posiblemente tengan que configurar certificados ssh y vincularlos a su cuenta de github con ssh-keygen:
https://dreyacosta.com/comandos-basicos-para-manejarse-con-git-y-github/
no tienen que hacer "git init", eso es si están creando un repo, en este caso ya está creado y se lo tienen que bajar

3) Bajarse node con nvm, es un comando útil, el node version manager. El proyecto está usando la versión de node más estable a la fecha (6.9.2)
https://github.com/creationix/nvm/blob/master/README.md

"nvm install 6.9.2"
esto instala también npm que se usa para correr el proyecto.

4) Bajarse un ide de preferencia (yo uso Sublime)

5) Bajarse las depentencias, parados dentro de la raiz del proyecto:
"npm install"

6) Correr el proyecto:
"npm start"
Otra forma de correrlo muy útil es con nodemon. Para instalarlo tipear "npm install -g nodemon" y luego para usarlo es simplemente con el comando "nodemon" parado en la raiz del proyecto. Lo que hace es levantarlo, y si cambia algun archivo lo vuelve a deployar en caliente sin necesidad de restart.
