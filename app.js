const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Paciente = require('./models/Paciente');
const Medico = require('./models/Medico');
const Agendamento = require('./models/Agendamento');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

// Sincronizar modelo com banco de dados
// sequelize.sync({ force: true }).then(() => {
//     console.log('Database syncede');
//   }).catch(err => {
//     console.error('Error syncing database:', err);
//   });

// Rotas para renderizar as páginas HTML

// Página inicial com lista de pacientes
app.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.render('index', { pacientes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Formulário para criar novo paciente
app.get('/pacientes/new', (req, res) => {
  res.render('new');
});

// Criar Paciente
app.post('/pacientes', async (req, res) => {
  try {
    const paciente = await Paciente.create(req.body);
    res.redirect('/pacientes');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Página para visualizar um paciente
app.get('/pacientes/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (paciente) {
      res.render('show', { paciente });
    } else {
      res.status(404).json({ error: 'Paciente not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Formulário para editar um paciente
app.get('/pacientes/:id/edit', async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (paciente) {
      res.render('edit', { paciente });
    } else {
      res.status(404).json({ error: 'Paciente not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar Paciente
app.post('/pacientes/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (paciente) {
      await paciente.update(req.body);
      res.redirect('/pacientes');
    } else {
      res.status(404).json({ error: 'Paciente not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar Paciente
app.post('/pacientes/:id/delete', async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (paciente) {
      await paciente.destroy();
      res.redirect('/pacientes');
    } else {
      res.status(404).json({ error: 'Paciente not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Medico
app.get('/medicos', async (req, res) => {
    const medicos = await Medico.findAll();
    res.render('medicos/index', { medicos });
  });
  
  app.get('/medicos/new', (req, res) => {
    res.render('medicos/new');
  });
  
  app.post('/medicos', async (req, res) => {
    const { nome, cpf, rg, numero_classe, profissao } = req.body;
    await Medico.create({ nome, cpf, rg, numero_classe, profissao });
    res.redirect('/medicos');
  });
  
  app.get('/medicos/:id', async (req, res) => {
    const medico = await Medico.findByPk(req.params.id);
    res.render('medicos/show', { medico });
  });
  
  app.get('/medicos/:id/edit', async (req, res) => {
    const medico = await Medico.findByPk(req.params.id);
    res.render('medicos/edit', { medico });
  });
  
  app.post('/medicos/:id', async (req, res) => {
    const { nome, cpf, rg, numero_classe, profissao } = req.body;
    await Medico.update({ nome, cpf, rg, numero_classe, profissao }, {
      where: { id: req.params.id }
    });
    res.redirect('/medicos');
  });
  
  app.post('/medicos/:id/delete', async (req, res) => {
    await Medico.destroy({
      where: { id: req.params.id }
    });
    res.redirect('/medicos');
  });

  app.get('/agendamentos', async (req, res) => {
    const agendamentos = await Agendamento.findAll({ include: [Paciente, Medico] });
    res.render('agendamentos/index', { agendamentos });
  });
  
  app.get('/agendamentos/new', async (req, res) => {
    const pacientes = await Paciente.findAll();
    const medicos = await Medico.findAll();
    res.render('agendamentos/new', { pacientes, medicos });
  });
  
  app.post('/agendamentos', async (req, res) => {
    const { data, horario, nome_paciente, nome_medico } = req.body;
    await Agendamento.create({ data, horario, nome_paciente, nome_medico });
    res.redirect('/agendamentos');
  });
  
  app.get('/agendamentos/:id', async (req, res) => {
    const agendamento = await Agendamento.findByPk(req.params.id, { include: [Paciente, Medico] });
    res.render('agendamentos/show', { agendamento });
  });
  
  app.get('/agendamentos/:id/edit', async (req, res) => {
    const agendamento = await Agendamento.findByPk(req.params.id);
    const pacientes = await Paciente.findAll();
    const medicos = await Medico.findAll();
    res.render('agendamentos/edit', { agendamento, pacientes, medicos });
  });
  
  app.post('/agendamentos/:id', async (req, res) => {
    const { data, horario, nome_paciente_id, nome_medico_id } = req.body;
    await Agendamento.update({ data, horario, nome_paciente_id, nome_medico_id }, {
      where: { id: req.params.id }
    });
    res.redirect('/agendamentos');
  });
  
  app.post('/agendamentos/:id/delete', async (req, res) => {
    await Agendamento.destroy({
      where: { id: req.params.id }
    });
    res.redirect('/agendamentos');
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
