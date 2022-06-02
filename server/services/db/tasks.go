package db

import (
	"BugTracker/api"
)

func (db *DB) GetAllTasks(projectId int) (*[]api.Task, error) {
	tasks := []api.Task{}
	task := api.Task{}

	rows, err := db.DB.Query(`
	SELECT id, title, description, state FROM tasks 
	WHERE project_id = $1`, projectId)

	if err != nil {
		return &[]api.Task{}, err
	}

	for rows.Next() {
		if err := rows.Scan(&task.Id, &task.Title, &task.Description, &task.State); err != nil {
			return &[]api.Task{}, err
		}
		tasks = append(tasks, task)
	}

	return &tasks, nil
}

func (db *DB) GetTasksByState(projectId int, state string) (*[]api.Task, error) {
	tasks := []api.Task{}
	task := api.Task{}

	rows, err := db.DB.Query(`
	SELECT id, title, description, state FROM tasks 
	WHERE project_id = $1 AND state = $2`, projectId, state)

	if err != nil {
		return &[]api.Task{}, err
	}

	for rows.Next() {
		if err := rows.Scan(&task.Id, &task.Title, &task.Description, &task.State); err != nil {
			return &[]api.Task{}, err
		}
		tasks = append(tasks, task)
	}

	return &tasks, nil
}

func (db *DB) AddTask(task *api.Task, projectId int) error {

	_, err := db.DB.Exec(`
	INSERT INTO tasks (title, state, description, creation_date, project_id)
	VALUES ($1, $2, $3, $4, $5)`, task.Title, task.State, task.Description, task.CreationDate, projectId)
	if err != nil {
		return err
	}

	return nil
}