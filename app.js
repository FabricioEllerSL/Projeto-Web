const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Paciente = require('./models/Paciente');
const Medico = require('./models/Medico');
const Agendamento = require('./models/Agendamento');
const Especialidade = require('./models/Especialidade');


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

app.get('/', (req, res) => {
  res.render('mainPage');
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

// Listar todas as especialidades
app.get('/especialidades', async (req, res) => {
  const especialidades = await Especialidade.findAll();
  res.render('especialidades/index', { especialidades });
});

// Formulário para criar nova especialidade
app.get('/especialidades/new', (req, res) => {
  res.render('especialidades/new');
});

// Criar nova especialidade
app.post('/especialidades', async (req, res) => {
  const { nome } = req.body;
  await Especialidade.create({ nome });
  res.redirect('/especialidades');
});

// Deletar especialidade
app.post('/especialidades/:id/delete', async (req, res) => {
  await Especialidade.destroy({ where: { id: req.params.id } });
  res.redirect('/especialidades');
});

// Listar todos os médicos
app.get('/medicos', async (req, res) => {
  const medicos = await Medico.findAll({ include: Especialidade });
  res.render('medicos/index', { medicos });
});

// Formulário para criar novo médico
app.get('/medicos/new', async (req, res) => {
  const especialidades = await Especialidade.findAll();
  res.render('medicos/new', { especialidades });
});

app.get('/medicos/:id', async (req, res) => {
  try {
    const medico = await Medico.findByPk(req.params.id, {
      include: Especialidade
    });
    if (!medico) {
      return res.status(404).send('Médico não encontrado');
    }
    res.render('medicos/show', { medico });
  } catch (error) {
    console.error('Erro ao buscar médico:', error);
    res.status(500).send('Erro interno do servidor');
  }
});
// Criar novo médico
app.post('/medicos', async (req, res) => {
  const { nome, cpf, rg, numero_classe, profissao, especialidadeId } = req.body;
  await Medico.create({ nome, cpf, rg, numero_classe, profissao, especialidadeId });
  res.redirect('/medicos');
});

// Formulário para editar médico
app.get('/medicos/:id/edit', async (req, res) => {
  const medico = await Medico.findByPk(req.params.id);
  const especialidades = await Especialidade.findAll();
  res.render('medicos/edit', { medico, especialidades });
});

// Atualizar médico
app.post('/medicos/:id', async (req, res) => {
  const { nome, cpf, rg, numero_classe, profissao, especialidadeId } = req.body;
  await Medico.update({ nome, cpf, rg, numero_classe, profissao, especialidadeId }, { where: { id: req.params.id } });
  res.redirect('/medicos');
});

// Deletar médico
app.post('/medicos/:id/delete', async (req, res) => {
  await Medico.destroy({ where: { id: req.params.id } });
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
