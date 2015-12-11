package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/codegangsta/negroni"
	"github.com/goji/httpauth"
	"github.com/gorilla/mux"
)

var templates = template.Must(template.ParseGlob("templates/*.html"))

func indexHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		templates.ExecuteTemplate(w, "index", struct{ Projects map[string]Project }{ Projects: projects })
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

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
	router.HandleFunc("/", indexHandler)
	router.HandleFunc("/projects", projectsHandler)
	router.HandleFunc("/project", projectHandler)
	router.Handle("/admin", basicAuth(adminHandler{}))

	n := negroni.Classic()
	n.UseHandler(router)
	n.Run(":8080")
}
