import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

export const routes: Routes = [
    {
        path:"",component:LoginComponent,title:"login Page"
    },

   
     {
        path:"dashboard",component:DashboardComponent,title:"dash Page"
    },
      {
        path:"register",component:RegisterComponent,title:"register Page"
    },
    {
         path:"home",component:HomeComponent,title:"home Page"
    },
      {
         path:"transaction",component:TransactionHistoryComponent,title:"transaction Page"
    },
];
