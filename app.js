//npm install express mongoose
//npm install -g nodemon
//npm install ejs

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = 'mongodb://127.0.0.1:27017/bdLoja';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Schema e Model (Coleção produtos)
const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  categoria: String,
  criadoEm: { type: Date, default: Date.now }
});

const Produto = mongoose.model('Produto', produtoSchema);

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();     
    res.render('produtos', { produtos });
  } catch (error) {
    res.status(500).send('Erro ao carregar a página de produtos: ' + error.message);
  }
});

app.get('/admin/produtos/cadastrar', (req, res) => {
  res.render('admin/produto-cadastrar');
});

app.post('/admin/produtos/cadastrar', async (req, res) => {
  try {
    const { nome, preco, categoria } = req.body;
    
    const novoProduto = new Produto({
      nome,
      preco: Number(preco),
      categoria
    });
    
    await novoProduto.save();
    
    res.redirect('/produtos');
  } catch (error) {
    res.status(500).send('Erro ao cadastrar produto: ' + error.message);
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});