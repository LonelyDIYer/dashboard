const SUPABASE_URL = "https://wueoyyljgttezgunpior.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZW95eWxqZ3R0ZXpndW5waW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Nzk0OTYsImV4cCI6MjA5MjU1NTQ5Nn0.ASpIg1RhKwbAmIIDw2Bu5SC12axvg-cR4WreTvj9uMc";

async function updateMonitor() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/river_status_logs?select=*&order=recorded_at.desc&limit=50`, {
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}` 
            }
        });
        const data = await response.json();
        if (data && data.length > 0) renderDashboard(data);
    } catch (err) {
        console.error(err);
        document.getElementById('errorMessage').style.display = 'block';
    }
}

function renderDashboard(data) {
    const latest = data[0];
    const loader = document.getElementById('loader');
    const telemetryBox = document.getElementById('telemetryBox');
    const indicator = document.getElementById('statusIndicator');
    const lastUpdated = document.getElementById('lastUpdated');

    if (loader) loader.style.display = 'none';
    if (telemetryBox) telemetryBox.style.display = 'flex';

    indicator.innerText = latest.status;
    indicator.className = 'status-display status-' + latest.status.toLowerCase();
    
    // UPDATED PREFIX HERE to stop "SYNC_OK"
    lastUpdated.innerText = ` ${new Date(latest.recorded_at).toLocaleTimeString()}`;

    const tableBody = document.getElementById('logsTableBody');
    tableBody.innerHTML = data.map(log => `
        <tr>
            <td class="status-${log.status.toLowerCase()}">${log.status}</td>
            <td style="color: #666; font-size: 0.75rem;">${new Date(log.recorded_at).toLocaleString()}</td>
        </tr>
    `).join('');
}

setInterval(updateMonitor, 3000);
updateMonitor();