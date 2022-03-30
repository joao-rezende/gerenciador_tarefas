import { useState } from 'react'
import styles from '../styles/Task.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faSave, faCircleNotch, faRemove } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import PopoverMenu from './PopoverMenu'

export default function Task(props) {
  const [task, setTask] = useState(props.task);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [description, setDescription] = useState(task ? task.description : '');
  const [period, setPeriod] = useState(task ? task.period : '');

  const headers = new Headers({
    "Content-Type": "application/json"
  });

  function formatDate(strDate) {
    const date = new Date(strDate);
    return date.toLocaleDateString() + " às " + date.toLocaleTimeString();
  }

  function insertTask() {
    setIsLoading(true);
    const newTask = {
      description: description,
      period: period,
      completed: false
    };

    fetch("/api/tasks", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(newTask)
    })
      .then(res => {
        if (res.status == 201) {
          setIsLoading(false);
        } else {
          console.error(res);
        }
        return res.json();
      })
      .then((data) => {
        setTask(data);
      });
  }

  function editTask() {
    setIsLoading(true);
    const newTask = {
      description: description,
      period: period,
      completed: task.completed
    };

    fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(newTask)
    })
      .then(res => {
        if (res.status == 200) {
          setIsLoading(false);
        } else {
          console.error(res);
        }
        return res.json();
      })
      .then((data) => {
        setTask(data);
      });
  }

  function saveTask() {
    if (!isEditable) {
      return insertTask();
    } else {
      setIsEditable(false);
      return editTask();
    }
  }

  function deleteTask() {
    setIsLoading(true);
    fetch(`/api/tasks/${task.id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status == 204) {
          props.onRemove(props.id);
          setIsLoading(false);
        } else {
          console.error(res);
        }
      })
  }

  function finishTask() {
    setIsLoading(true);
    const newTask = {
      description: task.description,
      period: task.period,
      completed: true
    };

    fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(newTask)
    })
      .then(res => {
        if (res.status == 200) {
          setIsLoading(false);
        } else {
          console.error(res);
        }
        return res.json();
      })
      .then((data) => {
        setTask(data);
      });
  }

  const loadingIcon = (
    <span className={styles.loading}>
      <FontAwesomeIcon icon={faCircleNotch} spin={true} style={{ animationDuration: "1.4s" }} />
    </span>
  );

  if (task && !isEditable) {
    const options = [
      {
        value: "Editar",
        onClick: () => { setIsEditable(true) }
      },
      {
        value: "Excluir",
        onClick: deleteTask
      }
    ];
    if (!task.completed) {
      options.unshift(
        {
          value: "Concluir",
          onClick: finishTask
        }
      )
    }

    return (
      <div className={styles.card}>
        <div className={styles.descriptionButtons}>
          <h2>{task.description}</h2>
          <div>
            <div>
              {isLoading && loadingIcon}
              {!isLoading && <PopoverMenu options={options} />}
            </div>
          </div>
        </div>
        {task.completed ?
          <p><FontAwesomeIcon className={styles.greenText} icon={faCircleCheck} /> Tarefa concluída</p>
          : <p><FontAwesomeIcon className={styles.yellowText} icon={faClock} /> {`Concluir até o dia ${formatDate(task.period)}`}</p>
        }
      </div>
    );
  } else {
    return (
      <div className={styles.card}>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className={styles.name} name="task_name" id="task-name" placeholder="Nome da tarefa" />
        <input type="datetime-local" value={period.substr(0, 16)} onChange={e => setPeriod(e.target.value)} className={styles.period} name="period" id="period" />

        <div className={styles.operationButtons}>
          {isLoading && loadingIcon}
          {
            !isLoading
            && <>
              <button className={styles.cancel} onClick={() => props.onRemove(props.id)} type="button">
                <FontAwesomeIcon icon={faRemove} />
              </button>
              <button className={styles.save} onClick={saveTask} type="button">
                <FontAwesomeIcon icon={faSave} />
              </button>
            </>
          }
        </div>
      </div>
    )
  }
}