package main

import (
	"net/http"
)

type adminHandler struct{}

func (_ adminHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		templates.ExecuteTemplate(w, "admin", struct{ Projects map[string]Project }{ Projects: projects })
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
