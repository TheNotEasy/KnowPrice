import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { BackgroundTask } from '@capawesome/capacitor-background-task';
import { GlobalService } from './global.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(global: GlobalService) {
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        return
      }
      const taskId = await BackgroundTask.beforeExit(async () => {
        global.commit()
    
        BackgroundTask.finish({ taskId })
      })
    })
  }
}
