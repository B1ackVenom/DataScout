from sqlalchemy import text
from app.db.database import SessionLocal


def build_stats():
    db = SessionLocal()

    print("Building player stats...")

    # Goals
    goals_query = """
    SELECT player_id, COUNT(*) as goals
    FROM events
    WHERE type = 'Shot'
    GROUP BY player_id
    """

    # Assists
    assists_query = """
    SELECT player_id, COUNT(*) as assists
    FROM events
    WHERE type = 'Pass'
    GROUP BY player_id
    """

    # Shots
    shots_query = """
    SELECT player_id, COUNT(*) as shots
    FROM events
    WHERE type = 'Shot'
    GROUP BY player_id
    """

    # Passes
    passes_query = """
    SELECT player_id, COUNT(*) as passes
    FROM events
    WHERE type = 'Pass'
    GROUP BY player_id
    """

    print("Running queries...")

    goals = {row[0]: row[1] for row in db.execute(text(goals_query))}
    assists = {row[0]: row[1] for row in db.execute(text(assists_query))}
    shots = {row[0]: row[1] for row in db.execute(text(shots_query))}
    passes = {row[0]: row[1] for row in db.execute(text(passes_query))}

    print("Combining stats...")

    player_stats = {}

    for player_id in set(list(goals.keys()) + list(shots.keys())):
        player_stats[player_id] = {
            "goals": goals.get(player_id, 0),
            "assists": assists.get(player_id, 0),
            "shots": shots.get(player_id, 0),
            "passes": passes.get(player_id, 0),
        }

    print("Sample output:\n")

    for i, (player_id, stats) in enumerate(player_stats.items()):
        print(f"Player {player_id}: {stats}")
        if i == 10:
            break

    db.close()


if __name__ == "__main__":
    build_stats()