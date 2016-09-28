package main

import (
	"code.google.com/p/go.net/websocket"
	// "io"
	"fmt"
	"net/http"
	"reflect"
)

var wsClient *websocket.Conn = nil

func main() {
	// http.HandleFunc("/", homeHandler)
	origin := "http://192.168.199.177/"
	url := "ws://192.168.199.177:9013"

	var err error
	wsClient, err = websocket.Dial(url, "", origin)
	if err != nil {
		fmt.Println(err)
	}

	// if _, err := ws.Write([]byte("hello, world!\n")); err != nil {
	//     fmt.Println(err)
	// }
	// var msg = make([]byte, 512)
	// var n int
	// if n, err = ws.Read(msg); err != nil {
	//     fmt.Println(err)
	// }
	// fmt.Printf("Received: %s.\n", msg[:n])

	http.Handle("/", websocket.Handler(wsHandler))
	http.ListenAndServe(":9013", nil)
}

func wsHandler(wsServer *websocket.Conn) {
	var err error
	//sMsg := "{\"action\":\"login\",\"data\":{\"uid\":\"30904062\",\"v\":\"2.0.2015111201\",\"self_bid\":\"com.anyu.app\"},\"code\":0,\"msg\":\"\",\"sid\":\"fdfdsf\",\"type\":2,\"sign\":\"4ffcd6b2fd116246638a52e12edb0d34\"}"
	// sMsg := "{\"action\":\"login\",\"data\":{\"v\":\"2.0.2015111201\",\"self_bid\":\"com.anyu.app\"},\"code\":0,\"msg\":\"\",\"sid\":1450159681562,\"type\":2,\"sign\":\"41a84ef8b9f270ae8ae23c8714f3a851\"}"
	for {
		s := ""
		if e := websocket.Message.Receive(wsServer, &s); e != nil {
			break
		}
		fmt.Println(reflect.TypeOf(wsServer))
		fmt.Println("r from h5:" + s + "\n")

		if _, err = wsClient.Write([]byte(s)); err != nil {
			fmt.Println(err)
		}
		var msg = make([]byte, 1024)
		var n int
		if n, err = wsClient.Read(msg); err != nil {
			fmt.Println(err)
		}
		fmt.Printf("r from app: %s\n", msg[:n])

		// io.WriteString(wsServer, string( msg ))
		// io.WriteString(wsServer, string(append(msg,'\n')))
		wsServer.Write(msg[:n])
		// io.Copy(wsServer, msg)
		// c := exec.Command("cmd", "/C", s)
		// if s, e := c.StderrPipe(); e == nil {
		//         go io.Copy(ws, s)
		// }
		// if s, e := c.StdoutPipe(); e == nil {
		//         if e := c.Start(); e == nil {
		//                 io.Copy(ws, s)
		//         }
		// }
	}
	wsServer.Close()
}

// func homeHandler(w http.ResponseWriter, r *http.Request) {
//         homeTpl.Execute(w, r.Host)
// }

// var homeTpl = template.Must(template.New("ws").Parse(`<html>
// <textarea id=idout rows=24 cols=72></textarea><hr>
// <input id=idin type=search placeholder='Enter a DOS command '
// onchange='send(this.value)'></input>
// <script>
//         var vout=document.getElementById('idout')
//         var vin =  document.getElementById('idin')
//         var wscon = new WebSocket("ws://{{.}}/ws")
//         wscon.onclose = function(e) {vout.value = 'websocket closed'}
//         wscon.onmessage = function(e) { vout.value += e.data }
//         function send(s) {
//                 vout.value = ""
//                 wscon.send(s)
//         }
// </script>
// `))
/*
打印消息：

尝试连接:ws://127.0.0.1:9013

成功打开websocket连接

发送消息:{"action":"lppa","params":{"bid":"fdsf"},"sid":"fdfdsf","type":1,"sign":""}

收到消息:{"action":"lppa","data":{"uid":"30904062","v":"2.0.2015111201","self_bid":"com.anyu.app"},"code":0,"msg":"","sid":"fdfdsf","type":2,"sign":"4ffcd6b2fd116246638a52e12edb0d34"}
*/
