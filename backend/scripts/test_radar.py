from backend.app.services.radar_service import get_radar_data, plot_radar

if __name__ == "__main__":
    player_name = "bruno fernandes"

    df = get_radar_data(player_name)
    print(df)

    plot_radar(df)