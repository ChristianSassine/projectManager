package routes

import (
	"BugTracker/api"
	"BugTracker/services/db"
	"BugTracker/utilities"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func TasksRoutes(r *gin.RouterGroup, db *db.DB) {

	// Getting all tasks endpoint
	r.GET("/project/:projectId/tasks", func(c *gin.Context) {

		projectIdString := c.Param("projectId")
		urlQueries := c.Request.URL.Query()

		projectId, err := strconv.Atoi(projectIdString)
		if err != nil {
			utilities.ErrorLog.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		taskState, ok := urlQueries["State"]
		if !ok {
			tasks, err := db.GetAllTasks(projectId)
			if err != nil {
				utilities.ErrorLog.Println(err)
				c.AbortWithStatus(http.StatusNotFound)
				return
			}
			c.JSON(http.StatusCreated, tasks)
			return
		}

		tasks, err := db.GetTasksByState(projectId, taskState[0])
		if err != nil {
			utilities.ErrorLog.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}
		c.JSON(http.StatusCreated, tasks)
	})

	// Creating a task endpoint
	r.POST("/project/:projectId/task", func(c *gin.Context) {
		projectIdString := c.Param("projectId")

		projectId, err := strconv.Atoi(projectIdString)
		if err != nil {
			utilities.ErrorLog.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		task := &api.Task{}

		if err := c.ShouldBind(task); err != nil {
			utilities.ErrorLog.Println(err)
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		if err := db.AddTask(task, projectId); err != nil {
			utilities.ErrorLog.Print(err)
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		c.Status(http.StatusCreated)
	})
}