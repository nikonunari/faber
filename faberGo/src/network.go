package main

import (
	"encoding/json"
	"errors"
	"faberGo/pkg/config"
	"faberGo/pkg/https"
	"fmt"
	"net/http"
)

func handlerHomePage(w http.ResponseWriter, r *http.Request) {
	welcomeHTML := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome</title>
    </head>
    <body>
        <h1>Welcome to our server!</h1>
        <p>This is a welcome page.</p>
    </body>
    </html>
    `
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "text/html")
	w.Write([]byte(welcomeHTML))
}

func defaultHeaderNetwork(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Token")
}

func handlerNetworkCreate(writer http.ResponseWriter, request *http.Request) {
	fmt.Println("handlerNetworkCreate")
	w, r, err := https.Dealer{
		Header:   defaultHeaderNetwork,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	postRequest := https.DealPostRequest(w, r, []string{
		"name",
	}...)
	if nil != postRequest.Err {
		return
	}

	// 检查
	for _, element := range *configs {
		if element.Key == r.PostFormValue("name") {
			https.SendResponseInternalError(w, r, errors.New("duplicate key. "), https.ResponseFalse)
			return
		}
	}
	// 创建
	*currentConfig = config.GenGenerateConfig()
	// 添加到配置列表
	*configs = append(*configs, currentConfig)
	// 设置名称
	currentConfig.Key = r.PostFormValue("name")
	// 保存配置文件
	err = currentConfig.SaveToPath(ConfigFiles)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	https.SendResponseOK(writer, request)
}

func handlerNetworkList(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderNetwork,
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
	dataTemp := &[]json.RawMessage{}
	for _, element := range *configs {
		temp, errIn := json.Marshal(*element)

		if nil != errIn {
			https.SendResponseInternalError(w, r, err, https.ResponseFalse)
			return
		}
		*dataTemp = append(*dataTemp, temp)
	}
	data, err := json.Marshal(*dataTemp)
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

func handlerNetworkDelete(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderNetwork,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	postRequest := https.DealPostRequest(w, r, []string{
		"name",
	}...)
	if nil != postRequest.Err {
		return
	}

	// 检查并删除
	for index, element := range *configs {
		if element.Key == r.PostFormValue("name") {

			errIn := config.Remove(ConfigFiles, (*configs)[index].Key)
			if nil != errIn {
				https.SendResponseInternalError(w, r, err, https.ResponseFalse)
				return
			}
			*configs = append((*configs)[:index], (*configs)[index+1:]...)
			break
		}
	}
	https.SendResponseOK(writer, request)
}

func handlerNetworkOpen(writer http.ResponseWriter, request *http.Request) {
	w, r, err := https.Dealer{
		Header:   defaultHeaderNetwork,
		Handlers: nil,
	}.Deal(writer, request)
	if nil != err {
		https.SendResponseInternalError(w, r, err, https.ResponseFalse)
		return
	}
	postRequest := https.DealPostRequest(w, r, []string{
		"name",
	}...)
	if nil != postRequest.Err {
		return
	}

	// 检查
	for _, element := range *configs {
		if element.Key == r.PostFormValue("name") {
			data, errIn := json.Marshal(*element)

			if nil != errIn {
				https.SendResponseInternalError(w, r, err, https.ResponseFalse)
				return
			}
			currentConfig = element
			https.SendJsonResponse(w, r, https.JsonResponse{
				Status:  https.ResponseTrue,
				Message: data,
				Code:    http.StatusOK,
			})
			return
		}
	}
	https.SendResponseInternalError(w, r, errors.New("No Key named "+r.PostFormValue("name")), https.ResponseFalse)
}
