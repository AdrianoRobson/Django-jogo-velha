//Pegando parâmetros da url
room_code = window.location.href.split('/').reverse()[1]
gamer = window.location.href.split('/').reverse()[0]

// WEBSOCKET
// Utilizando recursos de websocket do navegador
var connectionString = 'ws://' + window.location.host +'/ws/game/'+ room_code + '/'
var gameSocket = new WebSocket(connectionString)

// Pegando o grupo de divs contido dentro da div grid
var divs = document.querySelector(".grid").querySelectorAll("div");

// Mensagem inferior do tabuleiro
var msg_game = document.getElementById("msg")

// Pegando botao resetar
var botao_reset = document.querySelector('.restart')

// Variáveis que concatenam as 4 possibilidades para vencer
var horizontal = ''
var vertical = ''
var diagonal_p = ''
var diagonal = ''

// Vetor para transformar os ids da div em matrix 3x3
var matriz = []

// Armazena o jogador que venceu
var jogador_vencedor = ''

// Recebe x ou o do jogador da outra ponta
var jogador_receive = gamer

// Vetor de Ids das div
var vet_index = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

// Jogo da velha. 1 -> x ou O -> 0
var vet_player = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]

mostra_info()

// Recebe mensagens do websocket do outro lado
gameSocket.onmessage = function(e){

    // Quando houver mensagem vamos pegar os dados do retorno do message e colocar em dados depois extrair a mensagem
    var dados = JSON.parse(e.data);

    // id do tabuleiro do jogo do outro jogador
    var id = dados['message']['id'];

    if(id=='-1'){
         document.location.reload(true);
    }
    else{
        // Jogador x ou o do outro lado
        jogador_send = dados['message']['jogador'];

        // Altera x para o ou o para x para controlar a vez de cada jogador
        jogador_receive = (jogador_send.toLowerCase().trim()=='x') ? 'o' : 'x'

         if(gamer.toLowerCase().trim() == jogador_send.toLowerCase().trim() && soma_matriz(vet_player)== -9){

            alert('Jogador do outro lado também é '+gamer+"! Vc precisa escolher "+ jogador_receive.toUpperCase())

            window.history.back();

            restart()

        }

        // Retor a linha e coluna da matriz para marcar x ou o no tabuleiro quando o jogador do outro lado faz a jogada
        var linha_coluna = busca_id(id)

        // Mostra x ou o nas divs e registra jogadas
        jogador_vez(linha_coluna[0], linha_coluna[1], document.getElementById(id), jogador_send)

        // Mostra info na parte inferior do tubuleiro. Ex: Sua vez, Você venceu etc...
        mostra_info()
    }

}

for(let l = 0; l < 3; l++){
    matriz[l] = vet_index[l]
} 

for(let l = 0; l < 3; l++){

 for(let c = 0; c < 3; c++){

     var button = document.getElementById(divs[matriz[l][c]].getAttribute('id'))

     button.addEventListener("click", event => {

        // Para fazer a jogada:
        // 1º - Não pode haver nenhum vencedor
        // 2º - Tem que ser a vez do jogador x ou 0
        // 3º - Tem que clicar em uma das 9 pocições do tabuleiro que esteja vazia
        if(jogador_vencedor=='' &&
        (gamer.toLowerCase().trim() == jogador_receive.toLowerCase().trim()) &&
        event.target.innerText.trim()===''){

            jogador_vez(l, c, event.target, gamer)

            // Preparando dados para ser enviado para o websocket
             let data = {
                'message':{
                    'id': event.target.getAttribute('id'),
                    'jogador': gamer
                }
            }

            // Enviando dados para o websocket
            envia_websocket(data)
        }

        event.preventDefault();
     });
 }
}

botao_reset.addEventListener("click", event => {
    restart()
})

function restart(){

    // Preparando dados para ser enviado para o websocket
    let data = {
        'message':{
            'id': '-1',
            'jogador': gamer
        }
    }

    // Enviando dados para o websocket
    envia_websocket(data)

}

function mostra_info(){

    if(jogador_vencedor.trim()!='' && jogador_vencedor == gamer.toLowerCase()){
        msg_game.innerText = "Você venceu ;)"
    }
    else if(jogador_vencedor.trim()!='' && jogador_vencedor != gamer.toLowerCase()){
        msg_game.innerText = "Você perdeu :("
    }
    else if (!tem_num_negativo(vet_player)){
         msg_game.innerText = "Empate!"
    }
    else if((gamer.toLowerCase().trim() == jogador_receive.toLowerCase().trim())){
        msg_game.innerText = "Sua vez"
    }
    else if((gamer.toLowerCase().trim() != jogador_receive.toLowerCase().trim())){
        msg_game.innerText = "Vez do jogador "+ jogador_receive.toUpperCase()
    }
}

function busca_id(id){

    for(let l = 0; l < matriz.length; l++){
        for(let c = 0; c < matriz.length; c++){
            if(divs[matriz[l][c]].getAttribute('id') == id){
                return [l, c]
            }
        }
    }

    return []
}

function envia_websocket(data){
    // Enviar a mensagem através de json
    gameSocket.send(JSON.stringify(data));
}

function tem_num_negativo(matrix){
    for(let l = 0; l < matrix.length; l++){
        if( (matrix[l].filter((item) => {return item == -1}).length > 0 ) ){
            return true
        }
    }
    return false
}

function soma_matriz(matrix){
    var total = 0
    for(let i = 0; i < vet_player.length; i++){
        total += vet_player[i].reduce((a, b)=>{
            return a + b
        })
    }
    return total
}

function jogador_vez(linha, coluna, element, gamer_send){

    if(element.innerText.trim()===''){

         if(gamer_send.toLowerCase().trim()=='o'){

            element.classList.add("o");
            element.innerText = "O"
            registra_x_0(linha, coluna, 0)

        }
        else if(gamer_send.toLowerCase().trim()=='x'){

            element.classList.add("x");
            element.innerText = "X"
            registra_x_0(linha, coluna, 1)

        }

    } 
}

function registra_x_0(linha, coluna, x_o){

    vet_player[linha][coluna] = x_o  

    diagonal_p  = ''
    diagonal = ''

    for(let l = 0; l < 3; l++){
    
        horizontal = ''
        vertical = '' 
    
        for(let c = 0; c < 3; c++){ 

           //DIG
           if(l == c){ 
                //Diagonal principal
                diagonal_p += ''+vet_player[l][c]  
               
                //Diagonal
                diagonal += ''+vet_player[l][2-l]
           }
    
           //HOR        
           horizontal += ''+vet_player[l][c]  
    
           //VERT
           vertical += ''+vet_player[c][l]    

           vencedor(horizontal, vertical, diagonal_p, diagonal)
        }
    }
}     

function vencedor(hor, vert, dig_p, dig){

    if(hor.trim() === '000' || vert.trim() === '000' || dig_p.trim() === '000' || dig.trim() === '000'){
        jogador_vencedor = 'o'
    }
    else  if(hor.trim() === '111' || vert.trim() === '111' || dig_p.trim() === '111' || dig.trim() === '111'){
        jogador_vencedor = 'x'
    }
}





 

 