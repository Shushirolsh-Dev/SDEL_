package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "THESDEL backend is running")
	})

	fmt.Println("THESDEL backend running on port", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}