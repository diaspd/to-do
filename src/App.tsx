import { useState, FormEvent, InvalidEvent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import Plus from './assets/Plus.svg';
import Clipboard from './assets/Clipboard.svg';
import Microfone from './assets/Microfone.png';
import Pause from './assets/Pause.png';

import styles from './app.module.css';
import { Tasks } from './components/Tasks';
import { Header } from './components/Header';

export default function App() {
  const [ taskList, setTaskList ] = useState([
    {
			id:uuidv4(),
			content: 'Estudar Type Script',
			isComplete: false
		},
		{
			id:uuidv4(),
			content: 'Estudar React',
			isComplete: false
		},
  ]);
  const [taskContent, setTaskContent] = useState('')
  const [completedTasks, setCompletedTasks] = useState([])

  const [isRecording, setIsRecording] = useState(false)

  const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

  const speechRecognition = new SpeechRecognitionAPI();

  function saveTaskTitle(event) {
		setTaskContent(event.target.value)
	}

  function handleCreateNewTask(event: FormEvent) {
		event.preventDefault()
		setTaskList([ 
			{
				id:uuidv4(),
				content: taskContent,
				isComplete: false
			},
			...taskList,
		])
		setTaskContent('')
	}

  function deleteTask(taskID){
		const tasksWithoutDeletedOne = taskList.filter(task => {
			return task.id != taskID
		})

		const updatedCompletedTasks = tasksWithoutDeletedOne.filter(task => {
			if (task.isComplete){
				return task
		 	}
		})

		setCompletedTasks(updatedCompletedTasks)
		setTaskList(tasksWithoutDeletedOne)
	}

  function handleNewTaskInvalid(event: InvalidEvent<HTMLInputElement>) {
    event.target.setCustomValidity('Esse campo é obrigatório!')
  }

  function completeTask(taskID){
		const tasksUpdated = taskList.map(task => {
			if (task.id == taskID){
				let x = task.isComplete
				return {...task, isComplete: !x}
			}
			return task
		})

		const updatedCompletedTasks = tasksUpdated.filter(task => {
			if (task.isComplete){
				return task
		 	}
		})

		setCompletedTasks(updatedCompletedTasks)
		setTaskList(tasksUpdated)
	}

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação!");
      return;
    }

    setIsRecording(true);

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setTaskContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <>
     <Header />
    
        <form onSubmit={handleCreateNewTask} className={styles.createTask}>
          <input 
            placeholder="Adicione uma nova tarefa" 
            className={styles.input} 
            onChange={saveTaskTitle}
            value={taskContent}
            onInvalid={handleNewTaskInvalid}
            required
          />

         <div className={styles.buttonWrappper}>
          {isRecording ? (
            <button onClick={handleStopRecording} className={styles.microfoneButton} type="button">
            <img src={Pause} />
          </button>
          ): 
          <button onClick={handleStartRecording} className={styles.microfoneButton} type="button">
            <img src={Microfone} />
          </button>
          }
          
          <button 
            type="submit"
            className={styles.createButton}
          >
            Criar
            <img src={Plus} alt=""/> 
          </button>
         </div>
        </form>
     
   
      <div className={styles.tasksContainerWrapper}>
        <div className={styles.tasksContainer}>
          <div className={styles.createdInfo}>Tarefas criadas <div className={styles.count1}>{taskList.length}</div></div> 
          <div className={styles.concludedInfo}>Concluídas <div className={styles.count}>{completedTasks.length} de {taskList.length}</div></div> 
        </div> 
      </div>
 
      <div className={styles.tasks}>
        <div className={styles.newTasks}>
            {taskList.length == 0 ? 
            <div>
              <img src={Clipboard} alt="imagem agenda" /> 
              <p>Você ainda não tem tarefas cadastradas <br /> <br />
                Crie tarefas e organize seus itens a fazer
              </p> 
            </div>
              :
              taskList.map(task => {
                return (
                  <Tasks 
                    id={task.id}
                    key={task.id}
                    content={task.content}
                    onDeleteTask={deleteTask}
                    completeTask={completeTask}             
                  />
                )
              }) 
              }
        </div>
      </div>
    </>
  )
}
