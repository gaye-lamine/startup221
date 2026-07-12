import asyncio
import uuid
from datetime import datetime, timedelta
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import settings
from app.entities.startup import Startup
from app.entities.lead import Lead

async def seed():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    # Startups real seed data
    startups = [
        Startup(
            id=uuid.uuid4(),
            name="SenPay",
            slug="senpay",
            logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop",
            sector="Fintech",
            employee_count=18,
            description="La révolution du paiement mobile inter-opérable pour l'Afrique de l'Ouest. Transférez et payez instantanément avec sécurité accrue.",
            seeking=["Investisseurs", "Partenaires"],
            primary_color="#3545E6",
            funding_stage="Amorçage / Seed",
            city="Dakar, Sénégal",
            website_url="https://www.senpay.sn",
            linkedin_url="https://linkedin.com/company/senpay",
            twitter_url="https://twitter.com/senpay",
            problem_statement="Plus de 70% des commerçants au Sénégal n'ont pas accès à des outils de paiement numérique intégrés, limitant leur croissance et leur traçabilité financière.",
            solution_statement="Un terminal de point de vente intelligent et une application mobile qui agrègent tous les portefeuilles de monnaie mobile et cartes bancaires locaux.",
        ),
        Startup(
            id=uuid.uuid4(),
            name="SunuField",
            slug="sunufield",
            logo_url="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100&auto=format&fit=crop",
            sector="AgriTech",
            employee_count=8,
            description="Optimisation des récoltes par intelligence artificielle pour les coopératives agricoles locales. Augmentez vos rendements de 30%.",
            seeking=["Partenaires"],
            primary_color="#6366F1",
            funding_stage="Amorçage / Seed",
            city="Saint-Louis, Sénégal",
            website_url="https://www.sunufield.sn",
            linkedin_url="https://linkedin.com/company/sunufield",
            twitter_url="https://twitter.com/sunufield",
            problem_statement="Le manque de prévisibilité météo et d'analyse des sols réduit la productivité agricole locale et fragilise les revenus.",
            solution_statement="Des capteurs IoT connectés couplés à une intelligence artificielle pour analyser les sols et optimiser les cycles d'arrosage et d'engrais.",
        ),
        Startup(
            id=uuid.uuid4(),
            name="FastLivr",
            slug="fastlivr",
            logo_url="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop",
            sector="Logistique",
            employee_count=48,
            description="Dernier kilomètre automatisé pour le e-commerce et la livraison rapide à Dakar. Suivi précis en temps réel et planification intelligente.",
            seeking=["Série A"],
            primary_color="#3B82F6",
            funding_stage="Série A",
            city="Dakar, Sénégal",
            website_url="https://www.fastlivr.sn",
            linkedin_url="https://linkedin.com/company/fastlivr",
            twitter_url="https://twitter.com/fastlivr",
            problem_statement="La congestion urbaine à Dakar et l'absence d'adresses précises compliquent et renchérissent les coûts de livraison.",
            solution_statement="Un algorithme propriétaire de découpage géographique et de dispatching pour optimiser le trajet des livreurs en temps réel.",
        ),
        Startup(
            id=uuid.uuid4(),
            name="SanteConnect",
            slug="santeconnect",
            logo_url="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&auto=format&fit=crop",
            sector="HealthTech",
            employee_count=22,
            description="Dossier médical partagé et téléconsultation sécurisée pour désengorger les hôpitaux et accélérer les diagnostics en milieu rural.",
            seeking=["Recrutement"],
            primary_color="#0284C7",
            funding_stage="Amorçage / Seed",
            city="Thiès, Sénégal",
            website_url="https://www.santeconnect.sn",
            linkedin_url="https://linkedin.com/company/santeconnect",
            twitter_url="https://twitter.com/santeconnect",
            problem_statement="L'accès limité aux médecins spécialistes dans les régions reculées allonge les délais de prise en charge des patients.",
            solution_statement="Une application de téléconsultation ultra-légère optimisée pour la basse bande passante avec carnet de santé numérique intégré.",
        ),
    ]

    async with async_session() as session:
        async with engine.begin() as conn:
            # Drop and create tables cleanly
            await conn.run_sync(SQLModel.metadata.drop_all)
            await conn.run_sync(SQLModel.metadata.create_all)
            
        for s in startups:
            session.add(s)
        await session.commit()

        # Retrieve SenPay to link leads
        senpay = startups[0]
        
        leads = [
            Lead(
                id=uuid.uuid4(),
                startup_id=senpay.id,
                sender_name="Teranga Solutions",
                sender_entity="VC Fund - Seed",
                sender_email="contact@teranga.vc",
                message_type="Investisseur",
                created_at=datetime.utcnow() - timedelta(hours=2),
            ),
            Lead(
                id=uuid.uuid4(),
                startup_id=senpay.id,
                sender_name="Aissatou Maïga",
                sender_entity="Angel Investor",
                sender_email="aissatou.m@gmail.com",
                message_type="Investisseur",
                created_at=datetime.utcnow() - timedelta(days=2),
            ),
            Lead(
                id=uuid.uuid4(),
                startup_id=senpay.id,
                sender_name="Gainde Capital",
                sender_entity="Private Equity",
                sender_email="dealflow@gainde.capital",
                message_type="Partenaire",
                created_at=datetime.utcnow() - timedelta(days=5),
            ),
        ]
        
        for l in leads:
            session.add(l)
        await session.commit()
        
        print("Database seeded successfully with Startups and Leads!")

if __name__ == "__main__":
    asyncio.run(seed())
