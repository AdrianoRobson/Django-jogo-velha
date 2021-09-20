from channels.generic.websocket import AsyncWebsocketConsumer
import json


class GameConsumer(AsyncWebsocketConsumer):

    # Método de connexão do websocket
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = 'room_%s' % self.room_name

        # Entrar na seção do jogo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):

        print(f'[{self.channel_name}] - Disonnected | room_group_name: {self.room_group_name} ')

        # Sair da seção do jogo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        # Recebe mensagem que vem do websocket
        id = json.loads(text_data)['message']['id']
        jogador = json.loads(text_data)['message']['jogador']

        print(f'[{self.channel_name}] - Recieved message - {id} | jogador: {jogador}')

        # Envia a mensagem para a seção do jogo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_message',
                'message': {
                    'id': id,
                    'jogador': jogador,
                }
            }
        )

    async def game_message(self, data):
        """ Receive message from room group """
        print(f'[{self.channel_name}] - Message sent - {data["message"]["id"]}| jogador: {data["message"]["jogador"]}')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': {
                'id': data['message']['id'],
                'jogador': data['message']['jogador'],
            }
        }))
