package main

import (
	"html/template"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/codegangsta/negroni"
	"github.com/goji/httpauth"
	"github.com/gorilla/mux"
)

var templates = template.Must(template.ParseGlob("templates/*.html"))

func init() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM, os.Kill)

	if err := loadProjects(); err == nil {
		log.Println("Loaded", len(projects), "projects")
	}

	go func() {
		select {
		case <-c:
			os.Exit(0)
		}
	}()
}

func main() {
	basicAuth := httpauth.SimpleBasicAuth("blacksheeplive", "abcd1234")

	router := mux.NewRouter()
	router.HandleFunc("/projects", projectsHandler)
	router.Handle("/project", projectHandler{})
	router.Handle("/admin", basicAuth(adminHandler{}))

	n := negroni.Classic()
	n.UseHandler(router)
	n.Run(":8080")
}
