import styles from './Tasks.module.css';
import Trash from '../assets/Trash.svg';

interface TaskProps {
  content: string;
  onDeleteTask: (lists: number) => void;
  completeTask: any;
  id: number;
}

export function Tasks({ id, content, onDeleteTask, completeTask}: TaskProps) {

  function handleDeleteTask() {
    onDeleteTask(id);
  }

  function selectTaskToComplete(){
		completeTask(id)
	}

  return( 
    <div className={styles.container}>
      <input 
        type="checkbox"
        name={content}
        id={content}
        value={content}
        onMouseDown={selectTaskToComplete}
      />
      <p>{content}
      </p>
      
        <button 
          className={styles.deleteButton}
          onClick={handleDeleteTask}
        >
          <img src={Trash} alt="Lixeira" />
        </button>
    </div>
    
  )
}