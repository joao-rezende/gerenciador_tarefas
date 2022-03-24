import styles from '../styles/Task.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faSave, faCircleNotch, faCheck, faTrash, faRemove } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'

export default function Task(props) {
  const [task, setTask] = useState(props.task);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  function formatDate(strDate) {
    const date = new Date(strDate);
    return date.toLocaleDateString() + " às " + date.toLocaleTimeString();
  }

  function insertTask() {
    const newTask = {
      descricao: description,
      prazo: deadline,
      completa: false
    };

    fetch("https://virtserver.swaggerhub.com/neumar/Tarefas/1.0.0/tarefas", {
      body: JSON.stringify(newTask),
      method: "POST"
    })
      .then(res => {
        if (res.status == 201) {
          setTask(newTask)
        }
      })
  }

  function deleteTask() {
    setIsLoading(true);
    fetch(`https://virtserver.swaggerhub.com/neumar/Tarefas/1.0.0/tarefas/${task.id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status == 204) {
          props.onRemove(props.id);
          setIsLoading(false);
        }
      })
  }

  function concludeTask() {
    setIsLoading(true);
    const newTask = {
      descricao: task.descricao,
      prazo: task.prazo,
      completa: true
    };

    fetch(`https://virtserver.swaggerhub.com/neumar/Tarefas/1.0.0/tarefas/${task.id}`, {
      body: JSON.stringify(newTask),
      method: "PUT"
    })
      .then(res => {
        if (res.status == 201) {
          setTask(newTask)
          setIsLoading(false);
        }
      })
  }

  if (task) {
    let buttons;
    if (isLoading) {
      buttons = (
        <span className={styles.loading}>
          <FontAwesomeIcon icon={faCircleNotch} spin={true} style={{ animationDuration: "1.4s" }} />
        </span>
      );
    } else {
      buttons = (
        <>
          <button className={styles.delete} onClick={deleteTask} type="button"><FontAwesomeIcon icon={faTrash} /></button>
          {!task.completa && <button className={styles.conclude} onClick={concludeTask} type="button"><FontAwesomeIcon icon={faCheck} /></button>}
        </>
      );
    }

    return (
      <div className={styles.card}>
        <div className={styles.descriptionButtons}>
          <h2>{task.descricao}</h2>
          <div className={styles.buttonTask} style={{ minWidth: !task.completa && !isLoading ? 57.88 : 30.13 }}>
            {buttons}
          </div>
        </div>
        {task.completa ?
          <p><FontAwesomeIcon className={styles.greenText} icon={faCircleCheck} /> Tarefa concluída</p>
          : <p><FontAwesomeIcon className={styles.yellowText} icon={faClock} /> {`Concluir até o dia ${formatDate(task.prazo)}`}</p>
        }
      </div>
    );
  } else {
    return (
      <div className={styles.card}>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className={styles.name} name="task_name" id="task-name" placeholder="Nome da tarefa" />
        <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} className={styles.deadline} name="deadline" id="deadline" />

        <div className={styles.operationButtons}>
          <button className={styles.cancel} onClick={() => props.onRemove(props.id)} type="button"><FontAwesomeIcon icon={faRemove} /></button>
          <button className={styles.save} onClick={insertTask} type="button"><FontAwesomeIcon icon={faSave} /></button>
        </div>
      </div>
    )
  }
}