import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login-component/login.component';
import { WizardExpedienteComponent } from './components/wizard-expediente/wizard-expediente.component';

import { UsuarioList } from './components/usuario/usuario-list/usuario-list.component';
import { UsuarioForm } from './components/usuario/usuario-form/usuario-form.component';

import { RolList } from './components/rol/rol-list/rol-list.component';
import { RolForm } from './components/rol/rol-form/rol-form.component';

import { AreaList } from './components/area/area-list/area-list.component';
import { AreaForm } from './components/area/area-form/area-form.component';

import { CaracteristicaListComponent } from './components/caracteristica/caracteristica-list/caracteristica-list.component';
import { CaracteristicaFormComponent } from './components/caracteristica/caracteristica-form/caracteristica-form.component';

import { CargoList } from './components/cargo/cargo-list/cargo-list.component';
import { CargoForm } from './components/cargo/cargo-form/cargo-form.component';

import { ClasificacionListComponent } from './components/clasificacion/clasificacion-list/clasificacion-list.component';
import { ClasificacionFormComponent } from './components/clasificacion/clasificacion-form/clasificacion-form.component';

import { ComisionList } from './components/comision/comision-list/comision-list.component';
import { ComisionForm } from './components/comision/comision-form/comision-form.component';

import { ComisionMiembrosList } from './components/comisionmiembros/comisionmiembros-list/comisionmiembros-list.component';
import { ComisionmiembrosForm } from './components/comisionmiembros/comisionmiembros-form/comisionmiembros-form.component';

import { DictamenList } from './components/dictamen/dictamen-list/dictamen-list.component';
import { DictamenForm } from './components/dictamen/dictamen-form/dictamen-form.component';

import { DirectivoList } from './components/directivo/directivo-list/directivo-list.component';
import { DirectivoForm } from './components/directivo/directivo-form/directivo-form.component';

import { EntidadList } from './components/entidad/entidad-list/entidad-list.component';
import { EntidadForm } from './components/entidad/entidad-form/entidad-form.component';

import { EstructuraListComponent } from './components/estructura/estructura-list/estructura-list.component';
import { EstructuraFormComponent } from './components/estructura/estructura-form/estructura-form.component';

import { ExpedienteList } from './components/expediente/expediente-list/expediente-list.component';
import { ExpedienteFormComponent } from './components/expediente/expediente-form/expediente-form.component';

import { GrupoComisionList } from './components/grupo-comision/grupo-comision-list/grupo-comision-list.component';
import { GrupoComisionForm } from './components/grupo-comision/grupo-comision-form/grupo-comision-form.component';

import { InformeresumenList } from './components/informeresumen/informeresumen-list/informeresumen-list.component';
import { InformeresumenForm } from './components/informeresumen/informeresumen-form/informeresumen-form.component';

import { MedioBasicoList } from './components/mediobasico/mediobasico-list/mediobasico-list.component';
import { MediobasicoForm } from './components/mediobasico/mediobasico-form/mediobasico-form.component';

import { MovimientoAFTList } from './components/movimientoaft/movimientoaft-list/movimientoaft-list.component';
import { MovimientoaftForm } from './components/movimientoaft/movimientoaft-form/movimientoaft-form.component';

import { PersonaList } from './components/persona/persona-list/persona-list.component';
import { PersonaFormComponent } from './components/persona/persona-form/persona-form.component';

import { TipoMovimientoList } from './components/tipomovimiento/tipomovimiento-list/tipomovimiento-list.component';
import { TipomovimientoForm } from './components/tipomovimiento/tipomovimiento-form/tipomovimiento-form.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cargar', component: WizardExpedienteComponent },

    { path: 'usuarios/all', component: UsuarioList },
    { path: 'usuarios/edit', component: UsuarioForm },
    { path: 'usuarios/new', component: UsuarioForm },

    { path: 'roles/all', component: RolList },
    { path: 'roles/edit', component: RolForm },
    { path: 'roles/new', component: RolForm },

    { path: 'areas/all', component: AreaList },
    { path: 'areas/edit/:id', component: AreaForm },
    { path: 'areas/new', component: AreaForm },

    { path: 'caracteristica/all', component: CaracteristicaListComponent },
    { path: 'caracteristica/edit/:id', component: CaracteristicaFormComponent },
    { path: 'caracteristica/new', component: CaracteristicaFormComponent },

    { path: 'cargos/all', component: CargoList },
    { path: 'cargos/edit/:id', component: CargoForm },
    { path: 'cargos/new', component: CargoForm },

    { path: 'clasificacion/all', component: ClasificacionListComponent },
    { path: 'clasificacion/edit/:id', component: ClasificacionFormComponent },
    { path: 'clasificacion/new', component: ClasificacionFormComponent },

    { path: 'comisiones/all', component: ComisionList },
    { path: 'comisiones/edit/:id', component: ComisionForm },
    { path: 'comisiones/new', component: ComisionForm },

    { path: 'comisionmiembros/all', component: ComisionMiembrosList },
    { path: 'comisionmiembros/edit/:id', component: ComisionmiembrosForm },
    { path: 'comisionmiembros/new', component: ComisionmiembrosForm },

    { path: 'dictamenes/all', component: DictamenList },
    { path: 'dictamenes/edit/:id', component: DictamenForm },
    { path: 'dictamenes/new', component: DictamenForm },

    // Nuevas rutas agregadas:
    { path: 'directivos/all', component: DirectivoList },
    { path: 'directivos/edit/:id', component: DirectivoForm },
    { path: 'directivos/new', component: DirectivoForm },

    { path: 'entidades/all', component: EntidadList },
    { path: 'entidades/edit', component: EntidadForm },
    { path: 'entidades/new', component: EntidadForm },

    { path: 'estructuras/all', component: EstructuraListComponent },
    { path: 'estructuras/edit/:id', component: EstructuraFormComponent },
    { path: 'estructuras/new', component: EstructuraFormComponent },

    { path: 'expedientes/all', component: ExpedienteList },
    { path: 'expedientes/edit/:id', component: ExpedienteFormComponent },
    { path: 'expedientes/new', component: ExpedienteFormComponent },

    { path: 'grupo-comisiones/all', component: GrupoComisionList },
    { path: 'grupo-comisiones/edit/:id', component: GrupoComisionForm },
    { path: 'grupo-comisiones/new', component: GrupoComisionForm },

    { path: 'informes-resumen/all', component: InformeresumenList },
    { path: 'informes-resumen/edit/:id', component: InformeresumenForm },
    { path: 'informes-resumen/new', component: InformeresumenForm },

    { path: 'medio-basicos/all', component: MedioBasicoList },
    { path: 'medio-basicos/edit/:id', component: MediobasicoForm },
    { path: 'medio-basicos/new', component: MediobasicoForm },

    { path: 'movimientos-aft/all', component: MovimientoAFTList },
    { path: 'movimientos-aft/edit/:id', component: MovimientoaftForm },
    { path: 'movimientos-aft/new', component: MovimientoaftForm },

    { path: 'personas/all', component: PersonaList },
    { path: 'personas/edit/:id', component: PersonaFormComponent },
    { path: 'personas/new', component: PersonaFormComponent },

    { path: 'tipos-movimiento/all', component: TipoMovimientoList },
    { path: 'tipos-movimiento/edit', component: TipomovimientoForm },
    { path: 'tipos-movimiento/new', component: TipomovimientoForm },
];
