package main

import (
	"encoding/json"
	"faberGo/pkg/https"
	"fmt"
	"net/http"
)

func handlerInstall(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderBlockchain,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	postRequest := https.DealPostRequest(w, r, []string{}...)
	if nil != postRequest.Err {
		return
	}
	err = currentConfig.SaveToPath(ConfigFiles)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	https.SendResponseOK(writer, request)
}

func handlerDeploy(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderBlockchain,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	postRequest := https.DealPostRequest(w, r, []string{}...)
	if nil != postRequest.Err {
		return
	}
	err = currentConfig.SaveToPath(ConfigFiles)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	https.SendResponseOK(writer, request)
}

func handlerConfigSave(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderBlockchain,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	postRequest := https.DealPostRequest(w, r, []string{}...)
	if nil != postRequest.Err {
		return
	}
	err = currentConfig.SaveToPath(ConfigFiles)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	https.SendResponseOK(writer, request)
	fmt.Println("successfully save config")
}

func handlerConfigFetch(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderBlockchain,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	getRequest := https.DealGetRequest(w, r, []string{}...)
	if nil != getRequest.Err {
		return
	}
	data, err := json.Marshal(*currentConfig)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	https.SendJsonResponse(w, r, https.JsonResponse{
		Status:  https.ResponseTrue,
		Message: data,
		Code:    http.StatusOK,
	})
}

func handlerConfigGenerate(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderBlockchain,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	getRequest := https.DealGetRequest(w, r, []string{}...)
	if nil != getRequest.Err {
		return
	}
	data, err := json.Marshal(*currentConfig)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	https.SendJsonResponse(w, r, https.JsonResponse{
		Status:  https.ResponseTrue,
		Message: data,
		Code:    http.StatusOK,
	})
	fmt.Println("successfully generate config")
}
