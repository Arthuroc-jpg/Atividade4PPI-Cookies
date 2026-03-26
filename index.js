import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;
var vet_prod = [];

const server = express();

server.use(session({
  secret: "S3cr3tK3y",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*15}
}));

server.use(express.urlencoded({extended: true}));
server.use(cookieParser());

server.get("/",verLogin,(req,res) => {

    let ultimoAcesso = req.cookies?.ultimoAcesso;

const data = new Date();
res.cookie("ultimoAcesso",data.toLocaleString());

    res.setHeader("Content-Type","text/html");
   res.send(` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tela Inicial</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>
<body>
    <h2 style="text-align: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Menu Principal</h2>
    <ul class="nav justify-content-center">
        <li class="nav-item">
            <a class="nav-link" href="/">Menu</a>
        </li>
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="/login">Login</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/cadastrarProduto">Cadastrar</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/listarProdutos">Listar</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/logout">Sair</a>
  </li>
  <li class=nav-item>
  <p>Útlimo acesso: ${ultimoAcesso || "Primeiro Acesso"}</p>
  </li>
</ul>
<hr/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`);

});


server.get("/cadastrarProduto",verLogin,(req,res) => {
res.send(
    `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <h2 style="text-align: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Cadastro de Produtos</h2>
    <hr/> <br/>
    <form method="POST" action="/adicionarProduto" class="row g-3 needs-validation" novalidate>
       <div class="row">
  <div class="col">
    <input type="text" class="form-control" id="nome" name="nome" placeholder="Nome do Fabricante" aria-label="Nome do Fabricante">
  </div>
  <div class="col">
    <input type="text" id="cod" name="cod" class="form-control" placeholder="Código de Barras" aria-label="Código de Barras">
  </div>
  </div>

<br/>

<div class="row">
  <div class="col">
    <input type="text" id="custo" name="custo" class="form-control" placeholder="Preço de Custo" aria-label="Preço de Custo">
  </div>
  <div class="col">
    <input type="text" id="venda" name="venda" class="form-control" placeholder="Preço de Venda" aria-label="Preço de Venda">
  </div>
</div>

<br/>

  <div class="col-12">
    <label for="valid" class="form-label">Data de Validade</label>
    <input type="date" class="form-control" id="valid" name="valid">
  </div>

  <br/>

    <div class="col-12">
    <input type="number" class="form-control" id="estoque" name="estoque" placeholder="Quantidade em Estoque">
  </div>

  <br/>

<div class="mb-3">
  <textarea class="form-control" id="descr" name="descr" placeholder="Descrição" rows="3"></textarea>
</div>

<br/>

  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit">Adicionar</button>
  </div>

</form>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>    
</body>
</html>
    `
) });

server.post("/adicionarProduto",verLogin,(req,res) => {

  const fabri = req.body.nome;
  const codigo = req.body.cod;
  const quant = req.body.estoque;
  const custo = req.body.custo;
  const venda = req.body.venda;
  const validade = req.body.valid;
  const descri = req.body.descr;

  if(fabri && codigo && custo && venda && validade && quant && descri) {
  vet_prod.push({fabri,quant,custo,venda,validade});
  return res.redirect("/listarProdutos");
  }
  
  else {
    let conteudo =
    `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <h2 style="text-align: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Cadastro de Produtos</h2>
    <hr/> <br/>
    <form method="POST" action="/adicionarProduto" class="row g-3 needs-validation" novalidate>
       <div class="row">
  <div class="col">
    <input type="text" class="form-control" id="nome" name="nome" placeholder="Nome do Fabricante" value="${fabri}" aria-label="Nome do Fabricante">
    `;
    
    if(!fabri) {
      conteudo+=
        ` <div>
  <p class="text-danger">Informe o nome do fabricante</p>
  </div>`
    }

    conteudo +=
    `
    </div>
  <div class="col">
    <input type="text" id="cod" name="cod" class="form-control" placeholder="Código de Barras" value="${codigo}" aria-label="Código de Barras">
    `;

    if(!codigo) {
    conteudo+=
        ` <div>
  <p class="text-danger">Informe o codigo do produto</p>
  </div>`
  }

  conteudo+=
  `
   </div>
  </div>

<br/>

<div class="row">
  <div class="col">
  <input type="text" id="custo" name="custo" class="form-control" placeholder="Preço de Custo" value="${custo}" aria-label="Preço de Custo">
  `;

if(!custo) {
    conteudo+=
      ` <div>
  <p class="text-danger">Informe o preço de custo</p>
  </div>`
}

conteudo+=
`
</div>
  <div class="col">
    <input type="text" id="venda" name="venda" class="form-control" placeholder="Preço de Venda" value="${venda}" aria-label="Preço de Venda">
  </div>
</div>
`

if(!venda){
    conteudo+=
    ` <div>
  <p class="text-danger">Informe o preço de venda</p>
  </div>`
}

conteudo+=
`
 </div>
</div>

<br/>

  <div class="col-12">
    <label for="valid" class="form-label">Data de Validade</label>
    <input type="date" class="form-control" id="valid" name="valid" value="${validade}">
`;

if(!validade){
    conteudo+=
    ` <div>
  <p class="text-danger">Informe a data de validade</p>
  </div>`
}

conteudo+=
`
 </div>

  <br/>

    <div class="col-12">
    <input type="number" class="form-control" id="estoque" name="estoque" placeholder="Quantidade em Estoque" value="${quant}">
`;

if(!quant){
    conteudo+=
    ` <div>
  <p class="text-danger">Informe a quantidade no estouque</p>
  </div>`
}

conteudo+=
`
</div>

  <br/>

<div class="mb-3">
  <textarea class="form-control" id="descr" name="descr" placeholder="Descrição" rows="3" value="${descri || ""}"></textarea>
`

if(!descri){
    conteudo+=
    ` <div>
  <p class="text-danger">Informe uma descrição</p>
  </div>`
}

conteudo+=
`
</div>

<br/>

  <div class="col-12" style="text-align: center;">
    <button class="btn btn-primary" type="submit">Adicionar</button>
  </div>

</form>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

res.send(conteudo);
  }

  });

  server.get("/listarProdutos",verLogin,(req,res) => {
  let conteudo = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
        <h2 style="text-align: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Lista de Produtos</h2>
    <hr/> <br/>
    <div class="container">
    <table class="table">
     <thead>
    <tr>
      <th scope="col">Fabricante</th>
      <th scope="col">Quantidade</th>
      <th scope="col">Preço de Custo</th>
      <th scope="col">Preço de Venda</th>
      <th scope="col">Data de Validade</th>
    </tr>
  </thead>
</body>
</html>
  `;

  conteudo+=  `<tbody>`;

   for(let i=0;i<vet_prod.length;i++) {
    conteudo+=  `
    <tr>
    <td>${vet_prod[i].fabri}</td>
    <td>${vet_prod[i].quant}</td>
    <td>${vet_prod[i].custo}</td>
    <td>${vet_prod[i].venda}</td>
    <td>${vet_prod[i].validade}</td>

    </tr>
    ` };

    conteudo+=
  `</tbody>
 </table>
    <a class="btn btn-secondary" href="/">Voltar ao Menu</a>
  </div>
  </body>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</html>
`;

res.send(conteudo);
  });

  server.get("/login",(req,res) => {

   res.send( `
    
<!DOCTYPE html>

<head>
    <meta charset="utf-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body>
    <div class="container w-25">
        <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
            <fieldset class="border p-2">
                <legend class="mb-3">Autenticação do Sistema</legend>
                <div class="col-md-4">
                    <label for="" class="form-label">Usuário:</label>
                    <input type="text" class="form-control" id="usuario" name="usuario" required>
                </div>
                <div class="col-md-4">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" required>
                </div>
                <div class="col-12 mt-2">
                    <button class="btn btn-primary" type="submit">Login</button>
                </div>
            </fieldset>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>

</html>
    `)
  });

  server.post("/login",(req,res) =>{
    const {usuario,senha} = req.body;

    if(usuario==="admin" && senha==="admin") {
      req.session.dadosLogin = {nome:"ADM",logado:true};
      res.redirect("/");
    }

    else {
      res.send(
        `
        <!DOCTYPE html>

<head>
    <meta charset="utf-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<body>
    <div class="container w-25">
        <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
            <fieldset class="border p-2">
                <legend class="mb-3">Autenticação do Sistema</legend>
                <div class="col-md-4">
                    <label for="" class="form-label">Usuário:</label>
                    <input type="text" class="form-control" id="usuario" name="usuario" required>
                </div>
                <div class="col-md-4">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" required>
                </div>
                <div class="col-12 mt-2">
                    <button class="btn btn-primary" type="submit">Login</button>
                </div>
            </fieldset>
        </form>
           <div>
           <p class="text-danger">Usuário ou senha inválidos</p>
           </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>

</html>
        `
      )
    }
  });

  server.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");
  })

  function verLogin(req,res,next) {
    if(req.session.dadosLogin?.logado)
      next();

    else 
      res.redirect("/login");
  }

  server.listen(porta, host, () => {
console.log(`Servidor rodando em http://${host}:${porta}`) 
});