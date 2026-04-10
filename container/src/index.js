/**
 * Ponto de entrada do Container App.
 *
 * A importação dinâmica é essencial no Module Federation:
 * garante que o Webpack carregue os módulos remotos de forma assíncrona
 * antes de executar o código da aplicação.
 */
import('./bootstrap');
