import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CardsService } from '../../cards/services/cards.service';
import { environments } from 'src/app/environments/environments';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  private baseUrl: string = environments.deckBack;
  public messages: { name: string; message: string }[] = [];
  public message: string = '';
  private socket!: Socket;

  constructor(private cardService: CardsService) {
    const token = localStorage?.getItem('token');
    if (token) {
      this.socket = io(this.baseUrl, {
        extraHeaders: {
          authentication: token,
        },
      });
    } else {
      console.error('No JWT token found in local storage');
    }
  }

  ngOnInit(): void {
    if (this.socket) {
      this.socket.on('connect', () => {
      });

      this.socket.on('disconnect', () => {
      });

      this.socket.on(
        'message-from-server',
        (payload: { name: string; message: string }) => {
          this.messages.push(payload);
        }
      );

      this.socket.on(
        'all-messages',
        (messages: { name: string; message: string }[]) => {
          this.messages = messages;
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  private lastMessage: string = '';
  private lastMessageTime: number = 0;

  sendMessage(): void {
    const now = Date.now();
    if (this.message === this.lastMessage && now - this.lastMessageTime < 3000) {
      console.log('Este mensaje ya fue enviado recientemente.');
      return; 
    }
  
    if (this.message.trim().length === 0 || this.message.length > 150) {
      return; 
    }
  
    if (this.socket) {
      this.socket.emit('message-from-client', {
        message: this.message,
      });
  
      this.lastMessage = this.message; 
      this.lastMessageTime = now; 
      this.message = '';
    }
  }

  openChat(): void {
    this.cardService.isOpen = true;
  }

  closeChat(): void {
    this.cardService.isOpen = false;
  }

  get isOpen(): boolean {
    return this.cardService.isOpen;
  }
}
