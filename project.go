package main

import (
	"crypto/rand"
	"encoding/json"
	"io"
	"log"
	"math/big"
	"net/http"
	"os"
	"strconv"
)

type Project struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	PosterURL   string `json:"posterURL"`
	URL         string `json:"url"`
}

var projects = make(map[string]Project)

type projectHandler struct{}

func projectsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		http.ServeFile(w, r, "projects.json")
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func (_ projectHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		posterImage, posterImageHeader, err := r.FormFile("posterImage")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		defer posterImage.Close()

		if err := os.MkdirAll("public/images/projects", os.ModeDir | os.ModePerm); err != nil {
			if !os.IsExist(err) {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}

		posterURL := "images/projects/" + posterImageHeader.Filename
		file, err := os.OpenFile("public/"+posterURL, os.O_CREATE | os.O_WRONLY, 0666)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer file.Close()

		if _, err := io.Copy(file, posterImage); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		name := r.FormValue("name")
		if name == "" || len(name) < 3 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		description := r.FormValue("description")
		url := r.FormValue("url")

		id, err := generateID()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		projects[id] = Project{
			Name: name,
			Description: description,
			PosterURL: posterURL,
			URL: url,
		}

		if err := saveProjects(); err != nil {
			log.Fatal(err)
		}

		http.Redirect(w, r, "/admin", http.StatusFound)
	case "PATCH":
		id := r.FormValue("id")
		project, ok := projects[id]
		if !ok {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		posterImage, posterImageHeader, err := r.FormFile("posterImage")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if posterImageHeader != nil {
			os.Remove("public/" + project.PosterURL)

			if err := os.MkdirAll("public/images/projects", os.ModeDir | os.ModePerm); err != nil {
				if !os.IsExist(err) {
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
			}

			posterURL := "images/projects/" + posterImageHeader.Filename
			file, err := os.OpenFile("public/"+posterURL, os.O_CREATE | os.O_WRONLY, 0666)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			project.PosterURL = posterURL

			if _, err := io.Copy(file, posterImage); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			file.Close()
			posterImage.Close()
		}

		project.Name = r.FormValue("name")
		project.Description = r.FormValue("description")
		project.URL = r.FormValue("url")
		projects[id] = project

		if err := saveProjects(); err != nil {
			log.Fatal(err)
		}

		w.WriteHeader(http.StatusOK)
	case "DELETE":
		id := r.FormValue("id")
		if _, ok := projects[id]; !ok {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		delete(projects, id)

		if err := saveProjects(); err != nil {
			log.Fatal(err)
		}

		w.WriteHeader(http.StatusOK)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func generateID() (string, error) {
	max := big.NewInt(int64((^uint64(0)) >> 1))

	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}

	return strconv.FormatInt(n.Int64(), 10), nil
}

func loadProjects() error {
	file, err := os.Open("projects.json")
	if err != nil {
		return err
	}

	if err := json.NewDecoder(file).Decode(&projects); err != nil {
		return err
	}

	return nil
}

func saveProjects() error {
	file, err := os.OpenFile("projects.json", os.O_CREATE | os.O_WRONLY, 0666)
	if err != nil {
		return err
	}

	if err := json.NewEncoder(file).Encode(projects); err != nil {
		return err
	}
	return nil
}
