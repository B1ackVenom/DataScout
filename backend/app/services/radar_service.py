import pandas as pd
from backend.app.db.database import get_connection


def get_radar_data(player_name: str):
    conn = get_connection()

    # 🔥 STEP 1: Smart base player selection
    base_player_query = f"""
    SELECT player_name, role,
           goals_pct, xg_pct, assists_pct, xa_pct
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

    # ❌ No player found
    if base_df.empty:
        conn.close()
        return []

    base_player = base_df.iloc[0]['player_name']
    role = base_df.iloc[0]['role']

    goals = base_df.iloc[0]['goals_pct']
    xg = base_df.iloc[0]['xg_pct']
    assists = base_df.iloc[0]['assists_pct']
    xa = base_df.iloc[0]['xa_pct']

    # 🔥 STEP 2: Find similar players
    similar_query = f"""
    SELECT 
        player_name,
        role,
        goals_pct,
        xg_pct,
        assists_pct,
        xa_pct,

        SQRT(
            2 * POWER(goals_pct - {goals}, 2) +
            2 * POWER(xg_pct - {xg}, 2) +
            POWER(assists_pct - {assists}, 2) +
            POWER(xa_pct - {xa}, 2)
        ) AS similarity_score

    FROM player_percentiles
    WHERE role = '{role}'
      AND player_name != '{base_player}'

    ORDER BY similarity_score ASC
    LIMIT 2;
    """

    similar_df = pd.read_sql(similar_query, conn)

    conn.close()

    # 🔥 Combine base + similar
    final_df = pd.concat([
        base_df,
        similar_df.drop(columns=["similarity_score"])
    ])

    # 🔥 FIX NaN issue (IMPORTANT)
    final_df = final_df.fillna(0)

    return final_df