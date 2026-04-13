import pandas as pd
from backend.app.db.database import get_connection


def get_radar_data(player_name: str):
    conn = get_connection()

    # 🔥 BASE PLAYER
    base_player_query = f"""
    SELECT 
        player_name, role,
        goals_pct, xg_pct, assists_pct, xa_pct,
        shots_pct, passes_pct,
        interceptions_pct, duels_pct, clearances_pct, carries_pct
    FROM player_percentiles
    WHERE player_name ILIKE '%{player_name}%'
    ORDER BY 
        CASE 
            WHEN player_name ILIKE '%{player_name}%' AND role = 'Playmaker' THEN 0
            WHEN player_name ILIKE '{player_name}%' THEN 1
            ELSE 2
        END,
        goals_pct DESC
    LIMIT 1;
    """

    base_df = pd.read_sql(base_player_query, conn)

    if base_df.empty:
        conn.close()
        return []

    base_player = base_df.iloc[0]['player_name']
    role = base_df.iloc[0]['role']

    # 🔥 EXTRACT VALUES FOR SIMILARITY
    vals = base_df.iloc[0]

    # 🔥 SIMILAR PLAYERS (UPDATED WITH NEW METRICS)
    similar_query = f"""
    SELECT 
        player_name,
        role,
        goals_pct,
        xg_pct,
        assists_pct,
        xa_pct,
        shots_pct,
        passes_pct,
        interceptions_pct,
        duels_pct,
        clearances_pct,
        carries_pct,

        SQRT(
            POWER(goals_pct - {vals['goals_pct']}, 2) +
            POWER(xg_pct - {vals['xg_pct']}, 2) +
            POWER(assists_pct - {vals['assists_pct']}, 2) +
            POWER(xa_pct - {vals['xa_pct']}, 2) +
            POWER(shots_pct - {vals['shots_pct']}, 2) +
            POWER(passes_pct - {vals['passes_pct']}, 2) +
            POWER(interceptions_pct - {vals['interceptions_pct']}, 2) +
            POWER(duels_pct - {vals['duels_pct']}, 2) +
            POWER(clearances_pct - {vals['clearances_pct']}, 2) +
            POWER(carries_pct - {vals['carries_pct']}, 2)
        ) AS similarity_score

    FROM player_percentiles
    WHERE role = '{role}'
      AND player_name != '{base_player}'

    ORDER BY similarity_score ASC
    LIMIT 2;
    """

    similar_df = pd.read_sql(similar_query, conn)

    conn.close()

    final_df = pd.concat([
        base_df,
        similar_df.drop(columns=["similarity_score"])
    ])

    return final_df.fillna(0)