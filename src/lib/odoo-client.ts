import xmlrpc from 'xmlrpc';

export interface OdooLeadData {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    job_title?: string;
    description?: string;
}

class OdooClient {
    private url: string;
    private db: string;
    private username: string;
    private password: string;
    private uid: number | null = null;

    constructor() {
        this.url = process.env.ODOO_URL || '';
        // Odoo URL needs to be the root, not /odoo
        this.url = this.url.replace(/\/odoo$/, '');
        this.db = process.env.ODOO_DB || '';
        this.username = process.env.ODOO_USERNAME || '';
        this.password = process.env.ODOO_PASSWORD || '';
    }

    /**
     * Verifica si el cliente está configurado
     */
    isConfigured(): boolean {
        return !!(this.url && this.db && this.username && this.password);
    }

    /**
     * Autenticación con Odoo
     */
    private async authenticate(): Promise<number> {
        if (this.uid) return this.uid;

        console.log(`ODOO_AUTH: Intentando autenticar en ${this.url} (DB: ${this.db}, User: ${this.username})`);

        return new Promise((resolve, reject) => {
            const commonUrl = `${this.url}/xmlrpc/2/common`.replace(/([^:]\/)\/+/g, "$1"); // Evitar dobles barras
            const common = xmlrpc.createSecureClient(commonUrl);

            common.methodCall('authenticate', [this.db, this.username, this.password, {}], (error: any, value: any) => {
                if (error) {
                    console.error('ODOO_AUTH_ERROR (Network/XML-RPC):', error);
                    return reject(error);
                }
                if (!value) {
                    console.error('ODOO_AUTH_ERROR: Credenciales inválidas o DB no encontrada');
                    return reject(new Error('Authentication failed: Invalid credentials'));
                }
                console.log('ODOO_AUTH_SUCCESS: Login correcto, UID:', value);
                this.uid = value;
                resolve(value);
            });
        });
    }

    /**
     * Ejecuta un método en Odoo (execute_kw)
     */
    private async execute_kw(model: string, method: string, args: any[], kwargs: any = {}): Promise<any> {
        const uid = await this.authenticate();
        return new Promise((resolve, reject) => {
            const objectUrl = `${this.url}/xmlrpc/2/object`.replace(/([^:]\/)\/+/g, "$1");
            const models = xmlrpc.createSecureClient(objectUrl);

            console.log(`ODOO_EXECUTE: ${model}.${method} para UID ${uid}`);

            models.methodCall('execute_kw', [this.db, uid, this.password, model, method, args, kwargs], (error: any, value: any) => {
                if (error) {
                    console.error(`ODOO_EXECUTE_ERROR en ${model}.${method}:`, error);
                    return reject(error);
                }
                resolve(value);
            });
        });
    }

    /**
     * Crea un lead en CRM
     */
    async createLead(data: OdooLeadData): Promise<number | null> {
        if (!this.isConfigured()) return null;

        try {
            const leadId = await this.execute_kw('crm.lead', 'create', [{
                name: data.name,
                partner_name: data.company,
                function: data.job_title,
                email_from: data.email,
                phone: data.phone,
                description: data.description,
                type: 'opportunity', // Cambiado de 'lead' a 'opportunity' para Odoo en español
            }]);

            console.log('Odoo Lead created successfully:', leadId);
            return leadId;
        } catch (error) {
            console.error('Failed to create Odoo lead:', error);
            return null;
        }
    }

    /**
     * Actualiza la etapa del lead
     */
    async updateLeadStage(odooLeadId: number, stageId: number): Promise<boolean> {
        if (!this.isConfigured()) return false;

        try {
            await this.execute_kw('crm.lead', 'write', [[odooLeadId], {
                stage_id: stageId
            }]);
            return true;
        } catch (error) {
            console.error('Failed to update Odoo lead stage:', error);
            return false;
        }
    }

    /**
     * Actualiza datos generales del lead (descripción, nombre, etc.)
     */
    async updateLead(odooLeadId: number, data: Partial<OdooLeadData>): Promise<boolean> {
        if (!this.isConfigured()) return false;

        try {
            const updateData: any = {};
            if (data.name) updateData.name = data.name;
            if (data.email) updateData.email_from = data.email;
            if (data.phone) updateData.phone = data.phone;
            if (data.description) updateData.description = data.description;

            if (Object.keys(updateData).length === 0) return true;

            await this.execute_kw('crm.lead', 'write', [[odooLeadId], updateData]);
            console.log('Odoo Lead updated successfully:', odooLeadId);
            return true;
        } catch (error) {
            console.error('Failed to update Odoo lead:', error);
            return false;
        }
    }

    /**
     * Agenda una actividad/reunión en Odoo
     */
    async scheduleAppointment(odooLeadId: number, date: Date, summary: string): Promise<boolean> {
        if (!this.isConfigured()) return false;

        try {
            // En Odoo 19, las reuniones suelen ser 'mail.activity' vinculadas al lead
            // o registros en 'calendar.event'
            await this.execute_kw('mail.activity', 'create', [{
                res_id: odooLeadId,
                res_model_id: await this.getModelId('crm.lead'),
                activity_type_id: 4, // 4 suele ser "Meeting" o "Llamada"
                summary: summary,
                date_deadline: date.toISOString().split('T')[0],
                note: `Agendado automáticamente desde Chat IA especializado en PNL.`
            }]);
            return true;
        } catch (error) {
            console.error('Failed to schedule Odoo appointment:', error);
            return false;
        }
    }

    /**
     * Obtiene el ID numérico de un modelo por su nombre técnico
     */
    private async getModelId(modelName: string): Promise<number | null> {
        try {
            const result = await this.execute_kw('ir.model', 'search_read', [[['model', '=', modelName]]], { fields: ['id'], limit: 1 });
            return result[0]?.id || null;
        } catch (error) {
            return null;
        }
    }
}

export const odooClient = new OdooClient();
